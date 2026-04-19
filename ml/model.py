# =============================================================================
# MODEL TRAINING SCRIPT
# =============================================================================
# 
# PURPOSE: Train the Random Forest model and save it to a file.
# 
# RUN THIS WHEN:
#   - You have new training data
#   - You want to retrain the model
#   - First time setup (to create angina_model.pkl)
# 
# DO NOT RUN THIS FOR PREDICTIONS - Use api.py instead!
# 
# OUTPUT: angina_model.pkl (trained model file)
# 
# =============================================================================

# --- Import Libraries ---
import pandas as pd
import numpy as np
import pickle
import warnings
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold, cross_val_score, LeaveOneOut
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, roc_auc_score, roc_curve,
    matthews_corrcoef, cohen_kappa_score
)
import matplotlib.pyplot as plt
import seaborn as sns

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# --- Load Data ---
# Assumes 'Dataset Contoh.xlsx' is in the same directory as this script
df = pd.read_excel("./Dataset Contoh.xlsx", sheet_name="Sheet1")

print("=" * 60)
print("ANGINA PEKTORIS DETECTION - OPTIMIZED RANDOM FOREST MODEL")
print("=" * 60)

print("\n--- Original DataFrame Info ---")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print("\nFirst few rows:")
print(df.head())

# Check for class distribution
print("\n--- Class Distribution ---")
print(df['Klasifikasi/Label'].value_counts())

# --- Preprocessing ---

# 1. Drop the 'No RM' column (identifier) and all empty/unnamed columns
columns_to_drop = ['No RM'] + [col for col in df.columns if col.startswith('Unnamed:')]
df_cleaned = df.drop(columns=columns_to_drop)

print(f"\n--- After dropping unnecessary columns ---")
print(f"Columns remaining for processing: {df_cleaned.columns.tolist()}")
print(f"Shape after cleaning: {df_cleaned.shape}")

# Check for missing values in remaining columns
print("\n--- Missing Values Check ---")
missing_values = df_cleaned.isnull().sum()
print(missing_values[missing_values > 0] if missing_values.sum() > 0 else "No missing values found")

# 2. Apply transformations based on the classification notes

# --- Age Binning (Usia) ---
# Notes: 0: <20, 1: 20-40, 2: 40-60, 3: >60
def bin_usia(usia):
    """Bin age into categories based on medical guidelines."""
    if usia < 20:
        return 0
    elif usia < 40:
        return 1
    elif usia < 60:
        return 2
    else:
        return 3

df_cleaned['Usia_Binned'] = df_cleaned['Usia'].apply(bin_usia)

# --- Blood Pressure Binning (TD) ---
# Notes: 0: <120/80 (Normal), 1: 120-129/80-89 (Elevated), 2: >140/90 (High)
# Using unique labels to avoid pandas error, then remap
# --- Pain Duration Binning (Durasi Nyeri) ---
# Notes: 0: <15 menit, 1: >=15 menit
def parse_duration_to_minutes(durasi_text):
    """Convert text like '30 menit', '2 jam', '4 hari' to minutes."""
    try:
        parts = str(durasi_text).strip().split()
        if len(parts) != 2:
            return np.nan
        value = int(parts[0])
        unit = parts[1].lower()
        
        if unit in ['menit', 'minute', 'minutes']:
            return value
        elif unit in ['jam', 'hour', 'hours']:
            return value * 60
        elif unit in ['hari', 'day', 'days']:
            return value * 24 * 60
        else:
            print(f"Warning: Unknown unit '{unit}' in '{durasi_text}'")
            return np.nan
    except Exception as e:
        print(f"Warning: Could not parse duration '{durasi_text}': {e}")
        return np.nan

df_cleaned['Durasi_Nyeri_Menit'] = df_cleaned['Durasi Nyeri'].apply(parse_duration_to_minutes)

# Save median before filling NaN (needed for serving fallback)
duration_median = df_cleaned['Durasi_Nyeri_Menit'].median()

# Check for any parsing errors
if df_cleaned['Durasi_Nyeri_Menit'].isnull().any():
    print("\nWarning: Some duration values could not be parsed. Filling with median.")
    df_cleaned['Durasi_Nyeri_Menit'].fillna(duration_median, inplace=True)

def bin_durasi(menit):
    """Bin pain duration: 0=<15 min, 1=>=15 min"""
    return 0 if menit < 15 else 1

df_cleaned['Durasi_Nyeri_Binned'] = df_cleaned['Durasi_Nyeri_Menit'].apply(bin_durasi)

# --- Encode Binary Categorical Variables (Ya/Tidak) ---
binary_mapping = {'Tidak': 0, 'Ya': 1}
categorical_cols_to_encode = [
    'Riwayat DM', 'HT', 'Riwayat PJK terdahulu',
    'Sesak napas', 'Mual', 'Muntah'
]

print("\n--- Encoding Categorical Variables ---")
for col in categorical_cols_to_encode:
    unique_vals = df_cleaned[col].unique()
    print(f"{col}: {unique_vals}")
    df_cleaned[f'{col}_Encoded'] = df_cleaned[col].map(binary_mapping)
    
    # Check for unmapped values
    if df_cleaned[f'{col}_Encoded'].isnull().any():
        print(f"  Warning: Unmapped values in {col}, filling with 0 (Tidak)")
        df_cleaned[f'{col}_Encoded'].fillna(0, inplace=True)

# --- Encode Gender (Jenis Kelamin) ---
gender_mapping = {'L': 0, 'P': 1}  # Laki-laki: 0, Perempuan: 1
print(f"Jenis Kelamin: {df_cleaned['Jenis Kelamin'].unique()}")
df_cleaned['Jenis_Kelamin_Encoded'] = df_cleaned['Jenis Kelamin'].map(gender_mapping)

# --- Encode Target Label ---
label_mapping = {'Bukan Angina Pektoris': 0, 'Angina Pektoris': 1}
print(f"\nKlasifikasi/Label: {df_cleaned['Klasifikasi/Label'].unique()}")
df_cleaned['Label_Encoded'] = df_cleaned['Klasifikasi/Label'].map(label_mapping)

print(f"\n--- After Preprocessing ---")
print(f"Dataset shape: {df_cleaned.shape}")
print("\nSample of processed data:")
print(df_cleaned[['Usia', 'Usia_Binned', 'Durasi Nyeri', 'Durasi_Nyeri_Binned', 'Label_Encoded']].head())

# --- Prepare Features (X) and Target (y) ---
feature_columns = [
    'Usia_Binned',
    'Jenis_Kelamin_Encoded',
    'Riwayat DM_Encoded',
    'HT_Encoded',
    'Riwayat PJK terdahulu_Encoded',
    'Durasi_Nyeri_Binned',
    'Sesak napas_Encoded',
    'Mual_Encoded',
    'Muntah_Encoded',
]

X = df_cleaned[feature_columns]
y = df_cleaned['Label_Encoded']

print(f"\n--- Features and Target ---")
print(f"Features Shape: {X.shape}")
print(f"Target Shape: {y.shape}")
print("\nFeatures used for modeling:")
for i, col in enumerate(feature_columns, 1):
    print(f"  {i}. {col}")

print("\nTarget value distribution:")
print(y.value_counts())
print(f"Class balance: {y.value_counts()[1] / len(y) * 100:.1f}% positive class")

# Check for low variance features (potential issues)
print("\n--- Feature Variance Check ---")
for col in feature_columns:
    unique_count = X[col].nunique()
    if unique_count == 1:
        print(f"WARNING: {col} has zero variance (only 1 unique value)")
    elif unique_count == 2:
        print(f"INFO: {col} is binary ({X[col].unique()})")

# --- Split the data (80% train, 20% test) ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n--- Train/Test Split ---")
print(f"Training set size: {X_train.shape[0]} (Angina: {y_train.sum()}, Non-Angina: {len(y_train) - y_train.sum()})")
print(f"Test set size: {X_test.shape[0]} (Angina: {y_test.sum()}, Non-Angina: {len(y_test) - y_test.sum()})")

# --- Cross-Validation Setup ---
cv = LeaveOneOut()

# --- Hyperparameter Tuning with GridSearchCV ---
print(f"\n--- Hyperparameter Tuning (GridSearchCV) ---")

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, None],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt', None],
    'class_weight': ['balanced', None],
}

print(f"Parameter grid: {param_grid}")

rf_base = RandomForestClassifier(random_state=42)

grid_search = GridSearchCV(
    estimator=rf_base,
    param_grid=param_grid,
    cv=cv,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)

print("\nTraining with GridSearchCV (this may take a moment)...")
grid_search.fit(X_train, y_train)

print(f"\nBest Parameters: {grid_search.best_params_}")
print(f"Best Cross-Validation F1 Score: {grid_search.best_score_:.4f}")

# Use the best model
rf_model = grid_search.best_estimator_

# --- Leave-One-Out CV on full dataset (most reliable for 32 rows) ---
loo_preds = cross_val_score(rf_model, X, y, cv=LeaveOneOut(), scoring='accuracy')
print(f"\n--- Leave-One-Out CV Accuracy: {loo_preds.mean():.4f} ({int(loo_preds.sum())}/{len(loo_preds)} correct) ---")

# --- Make Predictions ---
y_pred = rf_model.predict(X_test)
y_pred_proba = rf_model.predict_proba(X_test)[:, 1]

# --- Evaluate the Model ---
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)
roc_auc = roc_auc_score(y_test, y_pred_proba) if len(np.unique(y_test)) > 1 else float('nan')
mcc = matthews_corrcoef(y_test, y_pred)
kappa = cohen_kappa_score(y_test, y_pred)

print("\n" + "=" * 60)
print("FINAL TEST SET PERFORMANCE")
print("=" * 60)
print(f"Accuracy:      {accuracy:.4f}")
print(f"Precision:     {precision:.4f}  (Of predicted Anginas, how many were true?)")
print(f"Recall:        {recall:.4f}  (Of true Anginas, how many were detected?)")
print(f"F1-Score:      {f1:.4f}  (Harmonic mean of Precision & Recall)")
print(f"ROC AUC:       {roc_auc:.4f}  (Discrimination ability)")
print(f"MCC:           {mcc:.4f}  (Matthews Correlation Coefficient)")
print(f"Cohen's Kappa: {kappa:.4f}  (Inter-rater agreement)")

# Detailed Classification Report
print("\n--- Detailed Classification Report ---")
print(classification_report(y_test, y_pred, target_names=['Bukan Angina', 'Angina']))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("\n--- Confusion Matrix ---")
print("                 Predicted")
print("                 BA    A")
print(f"Actual BA        {cm[0,0]:2d}    {cm[0,1]:2d}")
print(f"Actual A         {cm[1,0]:2d}    {cm[1,1]:2d}")

# Calculate specific metrics for medical context
tn, fp, fn, tp = cm.ravel()
specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
npv = tn / (tn + fn) if (tn + fn) > 0 else 0  # Negative Predictive Value
ppv = tp / (tp + fp) if (tp + fp) > 0 else 0  # Positive Predictive Value (Precision)

print(f"\n--- Medical Diagnostic Metrics ---")
print(f"Sensitivity (Recall):    {sensitivity:.4f}  - Ability to detect true Angina cases")
print(f"Specificity:             {specificity:.4f}  - Ability to rule out non-Angina cases")
print(f"PPV (Precision):         {ppv:.4f}  - Probability that positive test is true")
print(f"NPV:                     {npv:.4f}  - Probability that negative test is true")
print(f"False Negative Rate:     {fn/(tp+fn):.4f}  - Missed Angina cases (DANGEROUS!)")
print(f"False Positive Rate:     {fp/(tn+fp):.4f}  - False alarms")

# --- Visualizations ---
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Plot Confusion Matrix
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Bukan Angina', 'Angina'], 
            yticklabels=['Bukan Angina', 'Angina'],
            ax=axes[0])
axes[0].set_title('Confusion Matrix')
axes[0].set_xlabel('Predicted Label')
axes[0].set_ylabel('True Label')

# Plot ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
axes[1].plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
axes[1].plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', label='Random Classifier')
axes[1].set_xlim([0.0, 1.0])
axes[1].set_ylim([0.0, 1.05])
axes[1].set_xlabel('False Positive Rate')
axes[1].set_ylabel('True Positive Rate')
axes[1].set_title('ROC Curve')
axes[1].legend(loc="lower right")
axes[1].grid(True)

plt.tight_layout()
plt.savefig('model_evaluation.png', dpi=150, bbox_inches='tight')
print("\nPlot saved as 'model_evaluation.png'")
plt.show()

# --- Feature Importance ---
feature_importance = rf_model.feature_importances_
importance_df = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': feature_importance
}).sort_values(by='Importance', ascending=False)

print("\n--- Feature Importances ---")
print(importance_df)

# Plot Feature Importances
plt.figure(figsize=(10, 6))
sns.barplot(data=importance_df, x='Importance', y='Feature', palette='viridis')
plt.title('Feature Importance from Random Forest')
plt.xlabel('Importance Score')
plt.ylabel('Feature')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=150, bbox_inches='tight')
print("\nFeature importance plot saved as 'feature_importance.png'")
plt.show()

# --- Save the Model ---
model_data = {
    'model': rf_model,
    'feature_columns': feature_columns,
    'best_params': grid_search.best_params_,
    'metrics': {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'roc_auc': roc_auc,
        'mcc': mcc,
        'kappa': kappa,
        'sensitivity': sensitivity,
        'specificity': specificity
    },
    'preprocessing': {
        'binary_mapping': binary_mapping,
        'gender_mapping': gender_mapping,
        'label_mapping': label_mapping,
        'duration_median': duration_median,
    }
}

with open('angina_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("\n" + "=" * 60)
print("MODEL SAVED as 'angina_model.pkl'")
print("=" * 60)

# --- Prediction Function for Future Use ---
def predict_angina(patient_data):
    """
    Predict Angina Pektoris for a new patient.
    
    Parameters:
    -----------
    patient_data : dict
        Dictionary containing patient information with keys:
        - 'Usia': int (age in years)
        - 'Jenis Kelamin': str ('L' or 'P')
        - 'Riwayat DM': str ('Ya' or 'Tidak')
        - 'HT': str ('Ya' or 'Tidak')
        - 'Riwayat PJK terdahulu': str ('Ya' or 'Tidak')
        - 'Durasi Nyeri': str (e.g., '30 menit', '2 jam', '1 hari')
        - 'Sesak napas': str ('Ya' or 'Tidak')
        - 'Mual': str ('Ya' or 'Tidak')
        - 'Muntah': str ('Ya' or 'Tidak')
    
    Returns:
    --------
    dict: Prediction results with probability and classification
    """
    # Preprocess
    features = {}
    features['Usia_Binned'] = bin_usia(patient_data['Usia'])
    features['Jenis_Kelamin_Encoded'] = gender_mapping.get(patient_data['Jenis Kelamin'], 0)
    features['Durasi_Nyeri_Binned'] = bin_durasi(parse_duration_to_minutes(patient_data['Durasi Nyeri']))
    
    for col in categorical_cols_to_encode:
        features[f'{col}_Encoded'] = binary_mapping.get(patient_data[col], 0)
    
    # Create DataFrame
    X_new = pd.DataFrame([features])[feature_columns]
    
    # Predict
    prob = rf_model.predict_proba(X_new)[0, 1]
    pred = rf_model.predict(X_new)[0]
    
    return {
        'prediction': 'Angina Pektoris' if pred == 1 else 'Bukan Angina Pektoris',
        'probability_angina': float(prob),
        'probability_non_angina': float(1 - prob),
        'risk_level': 'HIGH' if prob > 0.7 else 'MODERATE' if prob > 0.3 else 'LOW'
    }

# Example usage
print("\n--- Example Prediction Function Usage ---")
example_patient = {
    'Usia': 65,
    'Jenis Kelamin': 'L',
    'Riwayat DM': 'Ya',
    'HT': 'Ya',
    'Riwayat PJK terdahulu': 'Tidak',
    'Durasi Nyeri': '20 menit',
    'Sesak napas': 'Ya',
    'Mual': 'Tidak',
    'Muntah': 'Tidak',
}

result = predict_angina(example_patient)
print(f"Example Patient: {example_patient}")
print(f"Prediction Result: {result}")

print("\n" + "=" * 60)
print("MODEL BUILDING AND EVALUATION COMPLETE")
print("=" * 60)
print("\n✅ SUCCESS! Model trained and saved to: angina_model.pkl")
print("\nNEXT STEPS:")
print("  1. Start the ML API service:")
print("     cd ml && source .venv/bin/activate && uvicorn api:app --reload --port 8000")
print("\n  2. In another terminal, start the web app:")
print("     cd web && php artisan serve --port 8001")
print("\n  3. Or use the start script:")
print("     ./start-services.sh")
print("\nNOTE: Keep the API service running to serve predictions!")
print("=" * 60)
