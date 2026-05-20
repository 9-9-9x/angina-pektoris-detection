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

import base64
import os
import pandas as pd
import numpy as np
import pickle
import warnings
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import plot_tree
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, roc_auc_score, roc_curve,
    matthews_corrcoef, cohen_kappa_score
)
import matplotlib.pyplot as plt
import seaborn as sns

warnings.filterwarnings('ignore')

# --- Load Data ---
df_raw = pd.read_csv("./datasetangina.csv")

df_raw = df_raw.rename(columns={
    'UMUR': 'Usia',
    'JENIS KELAMIN': 'Jenis Kelamin',
    'Riwayat HT': 'HT',
    'Riwayat PJK Terdahulu': 'Riwayat PJK terdahulu',
    'Sesak Napas': 'Sesak napas',
})

df = df_raw.dropna(subset=['Klasifikasi/Label']).reset_index(drop=True)

print("=" * 60)
print("ANGINA PEKTORIS DETECTION - RANDOM FOREST MODEL")
print("=" * 60)

print("\n--- Original DataFrame Info ---")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print("\nFirst few rows:")
print(df.head())

print("\n--- Class Distribution ---")
print(df['Klasifikasi/Label'].value_counts())

# --- Preprocessing ---
df_cleaned = df.copy()

print(f"\n--- After cleaning ---")
print(f"Shape: {df_cleaned.shape}")

print("\n--- Missing Values Check ---")
missing_values = df_cleaned.isnull().sum()
print(missing_values[missing_values > 0] if missing_values.sum() > 0 else "No missing values found")

# --- Age Binning ---
# 0: <20, 1: 20-40, 2: 40-60, 3: >60
def bin_usia(usia):
    if usia < 20:
        return 0
    elif usia < 40:
        return 1
    elif usia < 60:
        return 2
    else:
        return 3

df_cleaned['Usia_Binned'] = df_cleaned['Usia'].apply(bin_usia)

# --- Pain Duration Binning ---
# 0: <10 menit, 1: <15 menit, 2: >15 menit
duration_mapping = {'<10 Menit': 0, '<15 Menit': 1, '>15 Menit': 2}
df_cleaned['Durasi_Nyeri_Binned'] = df_cleaned['Durasi Nyeri'].map(duration_mapping).fillna(0).astype(int)
duration_median = 0

print(f"\nDuration unique values: {df_cleaned['Durasi Nyeri'].unique()}")

# --- Encode Binary Categorical Variables ---
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

    if df_cleaned[f'{col}_Encoded'].isnull().any():
        print(f"  Warning: Unmapped values in {col}, filling with 0 (Tidak)")
        df_cleaned[f'{col}_Encoded'].fillna(0, inplace=True)

# --- Encode Gender ---
gender_mapping = {'L': 0, 'P': 1}
print(f"Jenis Kelamin: {df_cleaned['Jenis Kelamin'].unique()}")
df_cleaned['Jenis_Kelamin_Encoded'] = df_cleaned['Jenis Kelamin'].map(gender_mapping)

# --- Encode Target Label ---
label_mapping = {'Bukan Angina Pektoris': 0, 'Angina Pektoris': 1}
print(f"\nKlasifikasi/Label: {df_cleaned['Klasifikasi/Label'].unique()}")
df_cleaned['Label_Encoded'] = df_cleaned['Klasifikasi/Label'].map(label_mapping)

print(f"\n--- After Preprocessing ---")
print(f"Dataset shape: {df_cleaned.shape}")

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
print(f"\nFeatures used:")
for i, col in enumerate(feature_columns, 1):
    print(f"  {i}. {col}")

print("\nTarget value distribution:")
print(y.value_counts())

# --- Split Data (80% train, 20% test) ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n--- Train/Test Split ---")
print(f"Training set size: {X_train.shape[0]}")
print(f"Test set size:     {X_test.shape[0]}")

# --- Train Random Forest (fixed parameters, no GridSearch) ---
print(f"\n--- Training Random Forest ---")

MODEL_PARAMS = {
    'n_estimators': 100,
    'max_depth': 5,
    'min_samples_leaf': 2,
    'max_features': 'sqrt',
    'class_weight': 'balanced',
    'random_state': 42,
}

print(f"Parameters: {MODEL_PARAMS}")

rf_model = RandomForestClassifier(**MODEL_PARAMS)
rf_model.fit(X_train, y_train)

print("Training complete.")

# --- 10-Fold Cross-Validation ---
skf10 = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
cv_scores = cross_val_score(rf_model, X, y, cv=skf10, scoring='accuracy')
print(f"\n--- 10-Fold CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f} ---")

# --- Make Predictions ---
y_pred = rf_model.predict(X_test)
y_pred_proba = rf_model.predict_proba(X_test)[:, 1]

# --- Evaluate ---
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
print(f"Precision:     {precision:.4f}")
print(f"Recall:        {recall:.4f}")
print(f"F1-Score:      {f1:.4f}")
print(f"ROC AUC:       {roc_auc:.4f}")
print(f"MCC:           {mcc:.4f}")
print(f"Cohen's Kappa: {kappa:.4f}")

print("\n--- Detailed Classification Report ---")
print(classification_report(y_test, y_pred, target_names=['Bukan Angina', 'Angina']))

cm = confusion_matrix(y_test, y_pred)
print("\n--- Confusion Matrix ---")
print("                 Predicted")
print("                 BA    A")
print(f"Actual BA        {cm[0,0]:2d}    {cm[0,1]:2d}")
print(f"Actual A         {cm[1,0]:2d}    {cm[1,1]:2d}")

tn, fp, fn, tp = cm.ravel()
specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
npv = tn / (tn + fn) if (tn + fn) > 0 else 0
ppv = tp / (tp + fp) if (tp + fp) > 0 else 0

print(f"\n--- Medical Diagnostic Metrics ---")
print(f"Sensitivity (Recall): {sensitivity:.4f}")
print(f"Specificity:          {specificity:.4f}")
print(f"PPV (Precision):      {ppv:.4f}")
print(f"NPV:                  {npv:.4f}")
print(f"False Negative Rate:  {fn/(tp+fn):.4f}  (DANGEROUS!)")
print(f"False Positive Rate:  {fp/(tn+fp):.4f}")

# --- Visualizations ---
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Bukan Angina', 'Angina'],
            yticklabels=['Bukan Angina', 'Angina'],
            ax=axes[0])
axes[0].set_title('Confusion Matrix')
axes[0].set_xlabel('Predicted Label')
axes[0].set_ylabel('True Label')

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

# --- Feature Importance ---
feature_importance = rf_model.feature_importances_
importance_df = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': feature_importance
}).sort_values(by='Importance', ascending=False)

print("\n--- Feature Importances ---")
print(importance_df)

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
    'params': MODEL_PARAMS,
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
        'duration_mapping': duration_mapping,
        'duration_median': duration_median,
    }
}

with open('angina_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("\n" + "=" * 60)
print("MODEL SAVED as 'angina_model.pkl'")
print("=" * 60)


# =============================================================================
# CARA KERJA RANDOM FOREST - VISUALISASI
# =============================================================================

FEATURE_DISPLAY_NAMES = {
    'Usia_Binned': 'Usia',
    'Jenis_Kelamin_Encoded': 'Jenis Kelamin',
    'Riwayat DM_Encoded': 'Riwayat DM',
    'HT_Encoded': 'Hipertensi',
    'Riwayat PJK terdahulu_Encoded': 'Riwayat PJK',
    'Durasi_Nyeri_Binned': 'Durasi Nyeri',
    'Sesak napas_Encoded': 'Sesak Napas',
    'Mual_Encoded': 'Mual',
    'Muntah_Encoded': 'Muntah',
}
display_feature_names = [FEATURE_DISPLAY_NAMES.get(f, f) for f in feature_columns]
CLASS_NAMES = ['Bukan Angina', 'Angina Pektoris']


def img_to_base64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def show_rf_working():
    print("\n" + "=" * 60)
    print("CARA KERJA RANDOM FOREST")
    print("=" * 60)

    # Contoh pasien
    example_raw = {
        'Usia': 65, 'Jenis Kelamin': 'L', 'Riwayat DM': 'Ya',
        'HT': 'Ya', 'Riwayat PJK terdahulu': 'Tidak',
        'Durasi Nyeri': '>15 Menit', 'Sesak napas': 'Ya',
        'Mual': 'Tidak', 'Muntah': 'Tidak',
    }

    features = {
        'Usia_Binned': bin_usia(example_raw['Usia']),
        'Jenis_Kelamin_Encoded': gender_mapping[example_raw['Jenis Kelamin']],
        'Riwayat DM_Encoded': binary_mapping[example_raw['Riwayat DM']],
        'HT_Encoded': binary_mapping[example_raw['HT']],
        'Riwayat PJK terdahulu_Encoded': binary_mapping[example_raw['Riwayat PJK terdahulu']],
        'Durasi_Nyeri_Binned': duration_mapping.get(example_raw['Durasi Nyeri'], 0),
        'Sesak napas_Encoded': binary_mapping[example_raw['Sesak napas']],
        'Mual_Encoded': binary_mapping[example_raw['Mual']],
        'Muntah_Encoded': binary_mapping[example_raw['Muntah']],
    }
    X_example = pd.DataFrame([features])[feature_columns]

    # Collect all votes
    tree_votes = [int(t.predict(X_example)[0]) for t in rf_model.estimators_]
    angina_votes = sum(tree_votes)
    non_angina_votes = len(tree_votes) - angina_votes
    vote_pct = angina_votes / len(tree_votes) * 100
    majority = CLASS_NAMES[1] if angina_votes > non_angina_votes else CLASS_NAMES[0]

    print(f"\n  Pasien contoh: {example_raw['Usia']} th, {example_raw['Jenis Kelamin']}, HT={example_raw['HT']}")
    print(f"  Angina votes:      {angina_votes}/{len(tree_votes)} pohon ({vote_pct:.1f}%)")
    print(f"  Bukan Angina:      {non_angina_votes}/{len(tree_votes)} pohon ({100-vote_pct:.1f}%)")
    print(f"  >> HASIL MAYORITAS: {majority} <<")

    # --- Generate tree PNG visualizations ---
    print(f"\n  Generating pohon visualizations...")
    tree_paths = []
    for i in range(min(3, len(rf_model.estimators_))):
        clf = rf_model.estimators_[i]
        vote_label = CLASS_NAMES[tree_votes[i]]
        fig, ax = plt.subplots(figsize=(32, 14))
        plot_tree(
            clf,
            feature_names=display_feature_names,
            class_names=CLASS_NAMES,
            filled=True,
            rounded=True,
            impurity=False,
            proportion=False,
            max_depth=3,
            ax=ax,
            fontsize=11,
        )
        ax.set_title(
            f'Pohon #{i+1}  —  Vote: {vote_label}  (ditampilkan 3 level pertama)',
            fontsize=15, fontweight='bold', pad=20
        )
        path = f'tree_pohon_{i+1}.png'
        fig.savefig(path, dpi=150, bbox_inches='tight', facecolor='white')
        plt.close(fig)
        tree_paths.append(path)
        print(f"  Pohon #{i+1} disimpan: {path}")

    # --- Generate HTML report ---
    def metric_row(label, value, note=''):
        return f'<tr><td>{label}</td><td><strong>{value}</strong></td><td style="color:#64748b;font-size:13px">{note}</td></tr>'

    voting_rows = ''
    for i, vote in enumerate(tree_votes):
        color = '#2563eb' if vote == 1 else '#ea580c'
        label = CLASS_NAMES[vote]
        voting_rows += f'<span title="Pohon {i+1}: {label}" style="display:inline-block;width:18px;height:18px;border-radius:3px;background:{color};margin:1px"></span>'

    tree_sections = ''
    for i, path in enumerate(tree_paths):
        b64 = img_to_base64(path)
        vote_label = CLASS_NAMES[tree_votes[i]]
        color = '#2563eb' if tree_votes[i] == 1 else '#ea580c'
        tree_sections += f'''
        <div style="margin-bottom:40px">
            <h3 style="color:{color};margin-bottom:8px">Pohon #{i+1} &nbsp;→&nbsp; Vote: {vote_label}</h3>
            <img src="data:image/png;base64,{b64}" style="max-width:100%;border:1px solid #e2e8f0;border-radius:8px">
        </div>'''

    b64_eval = img_to_base64('model_evaluation.png')
    b64_feat = img_to_base64('feature_importance.png')

    html = f'''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Random Forest — Laporan Pelatihan Model</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; background: #f8fafc; color: #1e293b; }}
  .wrap {{ max-width: 1100px; margin: 0 auto; padding: 40px 24px; }}
  h1 {{ font-size: 26px; font-weight: 700; margin-bottom: 4px; }}
  h2 {{ font-size: 18px; font-weight: 700; color: #0f172a; margin: 40px 0 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }}
  .card {{ background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,.06); }}
  table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
  td, th {{ padding: 8px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; }}
  th {{ background: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }}
  .badge {{ display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; }}
  .badge-angina {{ background: #dbeafe; color: #1d4ed8; }}
  .badge-bukan {{ background: #ffedd5; color: #c2410c; }}
  .stat-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }}
  .stat {{ text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }}
  .stat-val {{ font-size: 28px; font-weight: 700; color: #0f172a; }}
  .stat-lbl {{ font-size: 12px; color: #64748b; margin-top: 4px; }}
  .prog-bar {{ height: 14px; border-radius: 7px; background: #e2e8f0; overflow: hidden; margin: 8px 0; }}
  .prog-fill-a {{ height: 100%; background: #3b82f6; float: left; }}
  .prog-fill-b {{ height: 100%; background: #f97316; float: left; }}
</style>
</head>
<body>
<div class="wrap">
  <h1>🌲 Random Forest — Laporan Pelatihan Model</h1>
  <p style="color:#64748b;margin-bottom:32px">Angina Pektoris Detection &nbsp;|&nbsp; Dataset: 358 sampel &nbsp;|&nbsp; {rf_model.n_estimators} pohon keputusan</p>

  <h2>Parameter Model</h2>
  <div class="card">
    <table>
      <tr><th>Parameter</th><th>Nilai</th><th>Keterangan</th></tr>
      {metric_row('n_estimators', rf_model.n_estimators, 'Jumlah pohon dalam forest')}
      {metric_row('max_depth', rf_model.max_depth, 'Kedalaman maksimum tiap pohon')}
      {metric_row('min_samples_leaf', rf_model.min_samples_leaf, 'Min sampel di node daun')}
      {metric_row('max_features', rf_model.max_features, 'Fitur dipilih acak per split (√9 ≈ 3)')}
      {metric_row('class_weight', rf_model.class_weight, 'Penyeimbang kelas imbalanced')}
    </table>
  </div>

  <h2>Performa Model</h2>
  <div class="card">
    <div class="stat-grid" style="margin-bottom:20px">
      <div class="stat"><div class="stat-val">{accuracy:.1%}</div><div class="stat-lbl">Accuracy</div></div>
      <div class="stat"><div class="stat-val">{precision:.1%}</div><div class="stat-lbl">Precision</div></div>
      <div class="stat"><div class="stat-val">{recall:.1%}</div><div class="stat-lbl">Recall</div></div>
      <div class="stat"><div class="stat-val">{f1:.1%}</div><div class="stat-lbl">F1-Score</div></div>
    </div>
    <table>
      <tr><th>Metrik</th><th>Nilai</th><th>Keterangan</th></tr>
      {metric_row('ROC AUC', f'{roc_auc:.4f}', 'Kemampuan diskriminasi model')}
      {metric_row('Sensitivity', f'{sensitivity:.4f}', 'Deteksi Angina yang benar (recall)')}
      {metric_row('Specificity', f'{specificity:.4f}', 'Deteksi Bukan Angina yang benar')}
      {metric_row('MCC', f'{mcc:.4f}', 'Matthews Correlation Coefficient')}
      {metric_row('Cohen Kappa', f'{kappa:.4f}', 'Inter-rater agreement')}
      {metric_row('False Negative Rate', f'{fn/(tp+fn):.4f}', '⚠️ Angina yang tidak terdeteksi')}
    </table>
  </div>

  <h2>Evaluasi Visual</h2>
  <div class="card">
    <img src="data:image/png;base64,{b64_eval}" style="max-width:100%;border-radius:8px">
  </div>

  <h2>Feature Importance</h2>
  <div class="card">
    <img src="data:image/png;base64,{b64_feat}" style="max-width:100%;border-radius:8px">
  </div>

  <h2>Proses Majority Voting</h2>
  <div class="card">
    <p style="margin-bottom:12px">Pasien contoh: <strong>Usia 65 th, L, HT=Ya, Sesak Napas=Ya, DM=Ya, Durasi &gt;15 menit</strong></p>
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px">
        <span style="color:#2563eb">Angina Pektoris: <strong>{angina_votes} pohon ({vote_pct:.1f}%)</strong></span>
        <span style="color:#ea580c">Bukan Angina: <strong>{non_angina_votes} pohon ({100-vote_pct:.1f}%)</strong></span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill-a" style="width:{vote_pct}%"></div>
        <div class="prog-fill-b" style="width:{100-vote_pct}%"></div>
      </div>
    </div>
    <p style="font-size:13px;color:#64748b;margin-bottom:8px">Tiap kotak = 1 pohon &nbsp; <span style="background:#2563eb;color:white;padding:2px 8px;border-radius:3px;font-size:12px">Angina</span> &nbsp; <span style="background:#ea580c;color:white;padding:2px 8px;border-radius:3px;font-size:12px">Bukan Angina</span></p>
    <div style="line-height:1.2">{voting_rows}</div>
    <p style="margin-top:16px;font-size:15px"><strong>Hasil Mayoritas: <span style="color:{'#2563eb' if angina_votes > non_angina_votes else '#ea580c'}">{majority}</span></strong></p>
  </div>

  <h2>Struktur Pohon Keputusan (3 Pohon Pertama)</h2>
  <div class="card">
    <p style="color:#64748b;font-size:13px;margin-bottom:24px">
      Warna node: <strong>biru</strong> = mayoritas Angina Pektoris, <strong>oranye</strong> = mayoritas Bukan Angina.
      Semakin gelap = semakin murni (satu kelas dominan).
    </p>
    {tree_sections}
  </div>

  <p style="text-align:center;color:#94a3b8;font-size:13px;margin-top:40px">
    Dihasilkan oleh model.py &nbsp;|&nbsp; Sistem Klasifikasi Angina Pektoris
  </p>
</div>
</body>
</html>'''

    with open('rf_visualization.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"\n  HTML report disimpan: rf_visualization.html")
    print(f"  Buka di browser untuk lihat visualisasi lengkap.")


show_rf_working()

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
print("=" * 60)
