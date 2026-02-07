"""
=============================================================================
MODEL SERVING API - FastAPI Application
=============================================================================

PURPOSE: Serve the trained model via HTTP API for real-time predictions.

RUN THIS WHEN:
  - You want to use the model for predictions
  - Web app needs to connect to ML service
  - Production deployment

DO NOT RUN THIS TO TRAIN - Use model.py for training!

REQUIRES: angina_model.pkl (run model.py first to generate this)

Usage:
    uvicorn api:app --reload --host 0.0.0.0 --port 8000

Endpoints:
    GET  /          : Root endpoint with API info
    GET  /health    : Health check endpoint
    POST /predict   : Predict Angina Pektoris for a patient
    POST /predict/batch : Batch predictions
    GET  /docs      : Interactive API documentation (Swagger UI)
    GET  /redoc     : Alternative API documentation (ReDoc)

=============================================================================
"""

import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any, Literal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator

# ============================================================================
# MODEL LOADING AND GLOBAL VARIABLES
# ============================================================================

model_data = None
rf_model = None
feature_columns = None
preprocessing_config = None

# ============================================================================
# PREPROCESSING FUNCTIONS (Must match training logic)
# ============================================================================

def bin_usia(usia: int) -> int:
    """Bin age into categories: 0=<20, 1=20-40, 2=40-60, 3=>60"""
    if usia < 20:
        return 0
    elif usia < 40:
        return 1
    elif usia < 60:
        return 2
    else:
        return 3

def bin_td(td: int) -> int:
    """Bin blood pressure (systolic): 0=<120, 1=120-130, 2=>130"""
    if td < 120:
        return 0  # Normal
    elif td < 130:
        return 1  # Elevated
    else:
        return 2  # High

def parse_duration_to_minutes(durasi_text: str) -> int:
    """Convert duration text to minutes."""
    try:
        parts = str(durasi_text).strip().split()
        if len(parts) != 2:
            return 30  # Default fallback
        value = int(parts[0])
        unit = parts[1].lower()
        
        if unit in ['menit', 'minute', 'minutes']:
            return value
        elif unit in ['jam', 'hour', 'hours']:
            return value * 60
        elif unit in ['hari', 'day', 'days']:
            return value * 24 * 60
        else:
            return 30  # Default fallback
    except Exception:
        return 30  # Default fallback

def bin_durasi(menit: int) -> int:
    """Bin pain duration: 0=<5min, 1=5-10min, 2=>10min"""
    if menit < 5:
        return 0
    elif menit <= 10:
        return 1
    else:
        return 2

# ============================================================================
# PYDANTIC MODELS FOR VALIDATION
# ============================================================================

class PatientData(BaseModel):
    """
    Patient data for Angina Pektoris prediction.
    
    All fields are required for accurate prediction.
    """
    usia: int = Field(
        ..., 
        ge=0, 
        le=120, 
        description="Usia pasien dalam tahun (0-120)",
        example=65
    )
    jenis_kelamin: Literal['L', 'P'] = Field(
        ..., 
        description="Jenis kelamin: 'L' untuk Laki-laki, 'P' untuk Perempuan",
        example="L"
    )
    tekanan_darah: int = Field(
        ..., 
        ge=60, 
        le=300, 
        description="Tekanan darah sistolik dalam mmHg (60-300)",
        alias="TD",
        example=150
    )
    riwayat_dm: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Riwayat Diabetes Mellitus: 'Ya' atau 'Tidak'",
        alias="riwayat_DM",
        example="Ya"
    )
    hipertensi: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Status Hipertensi: 'Ya' atau 'Tidak'",
        alias="HT",
        example="Ya"
    )
    riwayat_pjk: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Riwayat Penyakit Jantung Koroner terdahulu: 'Ya' atau 'Tidak'",
        alias="riwayat_PJK_terdahulu",
        example="Tidak"
    )
    nyeri_menjalar: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Nyeri dada menjalar ke lengan: 'Ya' atau 'Tidak'",
        alias="nyeri_dada_menjalar_ke_lengan",
        example="Ya"
    )
    durasi_nyeri: str = Field(
        ..., 
        description="Durasi nyeri dada (contoh: '30 menit', '2 jam', '1 hari')",
        alias="durasi_nyeri",
        example="10 menit"
    )
    sesak_napas: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Mengalami sesak napas: 'Ya' atau 'Tidak'",
        alias="sesak_napas",
        example="Ya"
    )
    mual: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Mengalami mual: 'Ya' atau 'Tidak'",
        alias="mual",
        example="Tidak"
    )
    muntah: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Mengalami muntah: 'Ya' atau 'Tidak'",
        alias="muntah",
        example="Tidak"
    )
    keringat_dingin: Literal['Ya', 'Tidak'] = Field(
        ..., 
        description="Mengalami keringat dingin: 'Ya' atau 'Tidak'",
        alias="keringat_dingin",
        example="Ya"
    )

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "usia": 65,
                "jenis_kelamin": "L",
                "TD": 150,
                "riwayat_DM": "Ya",
                "HT": "Ya",
                "riwayat_PJK_terdahulu": "Tidak",
                "nyeri_dada_menjalar_ke_lengan": "Ya",
                "durasi_nyeri": "10 menit",
                "sesak_napas": "Ya",
                "mual": "Tidak",
                "muntah": "Tidak",
                "keringat_dingin": "Ya"
            }
        }


class PredictionResponse(BaseModel):
    """
    Response model for prediction endpoint.
    """
    prediction: Literal['Angina Pektoris', 'Bukan Angina Pektoris'] = Field(
        ...,
        description="Hasil prediksi model"
    )
    prediction_code: Literal[0, 1] = Field(
        ...,
        description="Kode prediksi: 0 = Bukan Angina, 1 = Angina"
    )
    probability_angina: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Probabilitas pasien menderita Angina Pektoris (0.0 - 1.0)"
    )
    probability_non_angina: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Probabilitas pasien TIDAK menderita Angina Pektoris (0.0 - 1.0)"
    )
    risk_level: Literal['LOW', 'MODERATE', 'HIGH'] = Field(
        ...,
        description="Tingkat risiko berdasarkan probabilitas"
    )
    risk_percentage: float = Field(
        ...,
        description="Persentase risiko Angina Pektoris"
    )
    confidence: str = Field(
        ...,
        description="Tingkat kepercayaan model terhadap prediksi"
    )
    features_used: Dict[str, Any] = Field(
        ...,
        description="Fitur yang digunakan untuk prediksi (setelah preprocessing)"
    )
    disclaimer: str = Field(
        ...,
        description="Peringatan penggunaan model"
    )


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    model_loaded: bool
    model_version: str
    message: str


class APIInfo(BaseModel):
    """API information response."""
    name: str
    version: str
    description: str
    endpoints: Dict[str, str]
    disclaimer: str

# ============================================================================
# MODEL LOADING FUNCTION
# ============================================================================

def load_model():
    """
    Load the trained model from angina_model.pkl file.
    
    IMPORTANT: This file is generated by model.py during training.
    If the file doesn't exist, run: python model.py
    
    Returns:
        bool: True if model loaded successfully, False otherwise
    """
    global model_data, rf_model, feature_columns, preprocessing_config
    
    try:
        # Load the pickle file created by model.py
        with open('angina_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
        
        # Extract components from the saved model
        rf_model = model_data['model']              # The trained Random Forest
        feature_columns = model_data['feature_columns']  # Feature names
        preprocessing_config = model_data['preprocessing']  # Encoding mappings
        
        print("✅ Model loaded successfully!")
        print(f"   - Feature columns: {len(feature_columns)}")
        print(f"   - Model type: {type(rf_model).__name__}")
        print(f"   - Source: angina_model.pkl (generated by model.py)")
        return True
    except FileNotFoundError:
        print("=" * 60)
        print("❌ ERROR: Model file 'angina_model.pkl' not found!")
        print("=" * 60)
        print("\nThis file is generated by running model.py")
        print("\nTo fix this:")
        print("  1. cd ml")
        print("  2. source .venv/bin/activate")
        print("  3. python model.py")
        print("\nThen restart this API service.")
        print("=" * 60)
        rf_model = None
        return False
    except Exception as e:
        print(f"⚠️  ERROR loading model: {e}")
        rf_model = None
        return False


# ============================================================================
# LOAD MODEL ON STARTUP
# ============================================================================
# This loads the model when the API server starts.
# The model stays in memory to serve predictions quickly.
# ============================================================================
load_model()


# ============================================================================
# LIFESPAN MANAGER (Handle startup/shutdown)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    # STARTUP: Model already loaded during import, but verify
    if rf_model is None:
        load_model()
    
    yield
    
    # SHUTDOWN: Cleanup (if needed)
    print("👋 Shutting down API...")

# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="Angina Pektoris Detection API",
    description="""
    API untuk deteksi Angina Pektoris menggunakan Machine Learning (Random Forest).
    
    ## Fitur
    
    * **Prediksi Angina Pektoris** - Menganalisis data klinis pasien
    * **Probabilitas Risiko** - Memberikan tingkat kepercayaan prediksi
    * **Klasifikasi Risiko** - LOW / MODERATE / HIGH
    
    ## Peringatan Penting ⚠️
    
    Model ini hanya untuk **tujuan riset dan edukasi**. 
    **JANGAN** digunakan sebagai satu-satunya dasar diagnosis medis.
    Selalu konsultasikan dengan dokter spesialis jantung untuk diagnosis definitif.
    
    ## Input yang Dibutuhkan
    
    * Data demografi: Usia, Jenis Kelamin
    * Tanda vital: Tekanan Darah
    * Riwayat medis: Diabetes, Hipertensi, PJK
    * Gejala klinis: Nyeri dada, Sesak napas, Mual, dll.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "Tim Data Science",
        "email": "support@example.com"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def preprocess_patient_data(patient: PatientData) -> pd.DataFrame:
    """
    Preprocess patient data to match model training format.
    
    Args:
        patient: PatientData object with raw clinical data
        
    Returns:
        DataFrame with preprocessed features ready for prediction
    """
    binary_mapping = {'Tidak': 0, 'Ya': 1}
    gender_mapping = {'L': 0, 'P': 1}
    
    features = {}
    
    # Binning transformations
    features['Usia_Binned'] = bin_usia(patient.usia)
    features['Jenis_Kelamin_Encoded'] = gender_mapping[patient.jenis_kelamin]
    features['TD_Binned'] = bin_td(patient.tekanan_darah)
    
    # Duration parsing and binning
    durasi_menit = parse_duration_to_minutes(patient.durasi_nyeri)
    features['Durasi_Nyeri_Binned'] = bin_durasi(durasi_menit)
    
    # Binary encoding
    features['Riwayat DM_Encoded'] = binary_mapping[patient.riwayat_dm]
    features['HT_Encoded'] = binary_mapping[patient.hipertensi]
    features['Riwayat PJK terdahulu_Encoded'] = binary_mapping[patient.riwayat_pjk]
    features['Nyeri dada menjalar ke lengan_Encoded'] = binary_mapping[patient.nyeri_menjalar]
    features['Sesak napas_Encoded'] = binary_mapping[patient.sesak_napas]
    features['Mual_Encoded'] = binary_mapping[patient.mual]
    features['Muntah_Encoded'] = binary_mapping[patient.muntah]
    features['Keringat dingin_Encoded'] = binary_mapping[patient.keringat_dingin]
    
    # Create DataFrame with correct column order
    X = pd.DataFrame([features])[feature_columns]
    
    return X, features


def get_risk_level(probability: float) -> str:
    """Determine risk level based on probability."""
    if probability > 0.7:
        return 'HIGH'
    elif probability > 0.3:
        return 'MODERATE'
    else:
        return 'LOW'


def get_confidence(probability: float) -> str:
    """Get confidence description based on probability."""
    if probability > 0.8 or probability < 0.2:
        return "High"
    elif probability > 0.6 or probability < 0.4:
        return "Moderate"
    else:
        return "Low (uncertain prediction)"

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", response_model=APIInfo, tags=["General"])
async def root():
    """
    Root endpoint - Returns API information.
    
    This is the welcome endpoint that provides basic information about the API
    and available endpoints.
    """
    return APIInfo(
        name="Angina Pektoris Detection API",
        version="1.0.0",
        description="Machine Learning API for detecting Angina Pektoris based on clinical data",
        endpoints={
            "health": "/health - Health check",
            "predict": "/predict - Predict Angina Pektoris (POST)",
            "docs": "/docs - API Documentation (Swagger UI)",
            "redoc": "/redoc - API Documentation (ReDoc)"
        },
        disclaimer="This API is for research purposes only. Not for clinical use without proper validation."
    )


@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health_check():
    """
    Health check endpoint.
    
    Use this to verify the API is running and the model is loaded properly.
    """
    if rf_model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please train and save the model first."
        )
    
    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_version="1.0.0",
        message="API is running and model is loaded successfully"
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Prediction"],
    summary="Predict Angina Pektoris",
    description="""
    Predict whether a patient has Angina Pektoris based on clinical data.
    
    The endpoint requires all clinical parameters and returns:
    - Prediction result (Angina or Not)
    - Probability scores
    - Risk level classification
    - Confidence level
    
    ## Example Request
    ```json
    {
        "usia": 65,
        "jenis_kelamin": "L",
        "TD": 150,
        "riwayat_DM": "Ya",
        "HT": "Ya",
        "riwayat_PJK_terdahulu": "Tidak",
        "nyeri_dada_menjalar_ke_lengan": "Ya",
        "durasi_nyeri": "10 menit",
        "sesak_napas": "Ya",
        "mual": "Tidak",
        "muntah": "Tidak",
        "keringat_dingin": "Ya"
    }
    ```
    """
)
async def predict(patient: PatientData):
    """
    Predict Angina Pektoris for a patient.
    
    Args:
        patient: Patient clinical data
        
    Returns:
        Prediction results with probabilities and risk assessment
    """
    # Check if model is loaded
    if rf_model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not available. Please ensure 'angina_model.pkl' exists."
        )
    
    try:
        # Preprocess the input data
        X_processed, features_dict = preprocess_patient_data(patient)
        
        # Make prediction
        prediction_proba = rf_model.predict_proba(X_processed)[0]
        prediction_class = rf_model.predict(X_processed)[0]
        
        # Extract probabilities
        prob_non_angina = float(prediction_proba[0])
        prob_angina = float(prediction_proba[1])
        
        # Determine risk level and confidence
        risk_level = get_risk_level(prob_angina)
        confidence = get_confidence(prob_angina)
        
        # Map prediction to label
        prediction_label = 'Angina Pektoris' if prediction_class == 1 else 'Bukan Angina Pektoris'
        
        return PredictionResponse(
            prediction=prediction_label,
            prediction_code=int(prediction_class),
            probability_angina=round(prob_angina, 4),
            probability_non_angina=round(prob_non_angina, 4),
            risk_level=risk_level,
            risk_percentage=round(prob_angina * 100, 2),
            confidence=confidence,
            features_used=features_dict,
            disclaimer=(
                "⚠️ DISCLAIMER: This prediction is generated by a machine learning model "
                "and is for research purposes only. It should NOT be used as the sole basis "
                "for medical diagnosis or treatment decisions. Always consult with a qualified "
                "healthcare professional for proper medical evaluation and diagnosis."
            )
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )


@app.post("/predict/batch", tags=["Prediction"])
async def predict_batch(patients: list[PatientData]):
    """
    Predict Angina Pektoris for multiple patients at once (batch prediction).
    
    Args:
        patients: List of patient data (max 100 patients per request)
        
    Returns:
        List of prediction results
    """
    if len(patients) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch size too large. Maximum 100 patients per request."
        )
    
    if rf_model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not available"
        )
    
    results = []
    for i, patient in enumerate(patients):
        try:
            X_processed, _ = preprocess_patient_data(patient)
            prediction_proba = rf_model.predict_proba(X_processed)[0]
            prediction_class = rf_model.predict(X_processed)[0]
            
            results.append({
                "patient_index": i,
                "prediction": 'Angina Pektoris' if prediction_class == 1 else 'Bukan Angina Pektoris',
                "probability_angina": round(float(prediction_proba[1]), 4),
                "risk_level": get_risk_level(float(prediction_proba[1])),
                "status": "success"
            })
        except Exception as e:
            results.append({
                "patient_index": i,
                "status": "error",
                "error_message": str(e)
            })
    
    return {
        "batch_size": len(patients),
        "successful_predictions": sum(1 for r in results if r["status"] == "success"),
        "failed_predictions": sum(1 for r in results if r["status"] == "error"),
        "results": results
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": exc.detail
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": 500,
            "message": f"Internal server error: {str(exc)}"
        }
    )

# ============================================================================
# MAIN ENTRY POINT (for development)
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("Starting Angina Pektoris Detection API...")
    print("Access the API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
