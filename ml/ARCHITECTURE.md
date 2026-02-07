# ML Service Architecture

## Overview

The ML component is split into two separate scripts with distinct responsibilities:

```
┌─────────────────────────────────────────────────────────────────┐
│                      ML COMPONENT                               │
├──────────────────────────────────┬──────────────────────────────┤
│                                  │                              │
│   model.py                       │   api.py                     │
│   ════════                       │   ══════                     │
│                                  │                              │
│   Purpose: TRAIN & SAVE          │   Purpose: SERVE PREDICTIONS │
│   ─────────────────────          │   ─────────────────────────  │
│                                  │                              │
│   • Load dataset                 │   • Load saved model         │
│   • Preprocess data              │   • Expose HTTP endpoints    │
│   • Train Random Forest          │   • Accept prediction        │
│   • Hyperparameter tuning        │     requests                 │
│   • Evaluate model               │   • Return predictions       │
│   • Save to angina_model.pkl     │   • Health check endpoint    │
│                                  │                              │
│   Run once (or when retraining)  │   Run continuously           │
│                                  │                              │
└──────────────────────────────────┴──────────────────────────────┘
         │                                    ▲
         │                                    │
         └────────── angina_model.pkl ────────┘
```

## Workflow

### 1. Training Phase (model.py)

```bash
# Run once to train and save the model
cd ml
source .venv/bin/activate
python model.py

# Output:
# - angina_model.pkl (saved model file)
# - model_evaluation.png (charts)
# - feature_importance.png (charts)
```

**What it does:**
- Reads `Dataset Contoh.xlsx`
- Cleans and preprocesses data
- Trains Random Forest with GridSearchCV
- Evaluates model performance
- Saves trained model to `angina_model.pkl`

### 2. Serving Phase (api.py)

```bash
# Run continuously to serve predictions
cd ml
source .venv/bin/activate
uvicorn api:app --reload --port 8000

# Or for production:
uvicorn api:app --host 0.0.0.0 --port 8000
```

**What it does:**
- Loads `angina_model.pkl` on startup
- Starts HTTP server on port 8000
- Waits for prediction requests
- Returns predictions in JSON format

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check if service is running |
| `/predict` | POST | Get prediction for patient data |
| `/predict/batch` | POST | Get predictions for multiple patients |
| `/docs` | GET | Swagger UI documentation |

## Example Request Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │────▶│  FastAPI    │────▶│   Model     │
│  (Laravel)  │     │   (api.py)  │     │  (pickle)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Response   │
                    │  (JSON)     │
                    └─────────────┘
```

## When to Run Each Script

### Run model.py when:
- You have new training data
- You want to retrain the model
- You changed model parameters
- First time setup

### Run api.py when:
- Web app needs to make predictions
- Starting the production server
- Testing the API

## File Dependencies

```
model.py ──────────┐
                   ├───▶ angina_model.pkl ────▶ api.py
Dataset Contoh.xlsx ┘
```

## Common Issues

### "ML Service Tidak Tersedia"
**Cause:** api.py is not running
**Fix:** Start the FastAPI server: `uvicorn api:app --reload`

### "Model file not found"
**Cause:** model.py hasn't been run yet
**Fix:** Run training first: `python model.py`

### "No module named 'fastapi'"
**Cause:** Dependencies not installed
**Fix:** `pip install fastapi uvicorn` or `uv sync`

## Development Workflow

```bash
# Terminal 1: Train model (one-time)
cd ml
python model.py

# Terminal 2: Start ML API (keep running)
cd ml
uvicorn api:app --reload --port 8000

# Terminal 3: Start Web App (keep running)
cd web
php artisan serve

# Terminal 4: Build frontend (keep running)
cd web
npm run dev
```

## Production Deployment

```bash
# ML Service (background)
uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4

# Laravel Web App
php artisan serve --host 0.0.0.0 --port 8001
# OR use nginx/apache
```

## Key Takeaway

> **model.py** = Build the brain (train once)
> **api.py** = Use the brain (serve forever)

They work together but serve completely different purposes!
