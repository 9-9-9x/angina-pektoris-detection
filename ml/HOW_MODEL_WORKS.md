# bagaimana model ini dibuat

## 1. persiapan data

pertama kita baca file `datasetangina.csv` lalu rename beberapa kolom supaya konsisten. baris yang tidak punya label (`Klasifikasi/Label` kosong) langsung dibuang karena tidak bisa dipakai untuk training.

```python
df_raw = pd.read_csv("./datasetangina.csv")
df_raw = df_raw.rename(columns={'UMUR': 'Usia', 'JENIS KELAMIN': 'Jenis Kelamin', ...})
df = df_raw.dropna(subset=['Klasifikasi/Label']).reset_index(drop=True)
```

setelah itu kita transformasi kolom-kolom yang masih berbentuk teks atau angka mentah supaya bisa dibaca model:

| kolom asli | bentuk awal | jadi |
|---|---|---|
| Usia | angka tahun (misal 55) | dikelompokkan: <20=0, 20-40=1, 40-60=2, >60=3 |
| Durasi Nyeri | teks `<10 Menit` / `<15 Menit` / `>15 Menit` | 0 / 1 / 2 |
| Riwayat DM, HT, dll | teks `Ya` / `Tidak` | 1 atau 0 |
| Jenis Kelamin | `L` / `P` | 0 atau 1 |
| Klasifikasi/Label | `Angina Pektoris` / `Bukan Angina Pektoris` | 1 atau 0 |

```python
# usia di-bin per rentang umur
df_cleaned['Usia_Binned'] = df_cleaned['Usia'].apply(bin_usia)

# durasi nyeri 3 kelas ordinal
duration_mapping = {'<10 Menit': 0, '<15 Menit': 1, '>15 Menit': 2}
df_cleaned['Durasi_Nyeri_Binned'] = df_cleaned['Durasi Nyeri'].map(duration_mapping)

# ya/tidak → 1/0
binary_mapping = {'Tidak': 0, 'Ya': 1}
categorical_cols_to_encode = ['Riwayat DM', 'HT', 'Riwayat PJK terdahulu', 'Sesak napas', 'Mual', 'Muntah']
for col in categorical_cols_to_encode:
    df_cleaned[f'{col}_Encoded'] = df_cleaned[col].map(binary_mapping)

# gender
gender_mapping = {'L': 0, 'P': 1}
df_cleaned['Jenis_Kelamin_Encoded'] = df_cleaned['Jenis Kelamin'].map(gender_mapping)

# label target
label_mapping = {'Bukan Angina Pektoris': 0, 'Angina Pektoris': 1}
df_cleaned['Label_Encoded'] = df_cleaned['Klasifikasi/Label'].map(label_mapping)
```

dari semua kolom yang ada, kita pilih 9 kolom sebagai fitur input (X) dan 1 kolom label sebagai target (y).

```python
feature_columns = [
    'Usia_Binned', 'Jenis_Kelamin_Encoded', 'Riwayat DM_Encoded',
    'HT_Encoded', 'Riwayat PJK terdahulu_Encoded', 'Durasi_Nyeri_Binned',
    'Sesak napas_Encoded', 'Mual_Encoded', 'Muntah_Encoded',
]

X = df_cleaned[feature_columns]
y = df_cleaned['Label_Encoded']
```

---

## 2. data siap training

setelah preprocessing selesai, data dibagi jadi **80% training dan 20% testing** secara stratified — artinya proporsi kelas angina vs bukan angina dijaga sama di kedua bagian, supaya tidak timpang.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```

---

## 3. cari hyperparameter terbaik (gridsearchcv)

sebelum training sungguhan, kita pakai `GridSearchCV` untuk cari kombinasi parameter terbaik dari `RandomForestClassifier`. caranya: kita kasih daftar pilihan nilai untuk tiap parameter, lalu gridsearch mencoba semua kombinasinya satu per satu.

```python
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, None],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt', None],
    'class_weight': ['balanced', None],
}
```

| parameter | pilihan yang dicoba |
|---|---|
| n_estimators | 100, 200, 300 |
| max_depth | 3, 5, None |
| min_samples_leaf | 1, 2 |
| max_features | sqrt, None |
| class_weight | balanced, None |

setiap kombinasi diuji pakai **stratified 5-fold cross-validation** pada data training — data dibagi 5 bagian, model dilatih 5 kali (tiap kali 1 bagian jadi validasi), skornya dirata-rata. kombinasi dengan rata-rata akurasi tertinggi itulah yang dipilih sebagai `best_params`.

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=cv,
    scoring='accuracy',
    n_jobs=-1,
)
grid_search.fit(X_train, y_train)

print(f"Best Parameters: {grid_search.best_params_}")

# ambil model dengan parameter terbaik
rf_model = grid_search.best_estimator_
```

`best_estimator_` itu langsung model yang sudah dilatih dengan kombinasi parameter terbaik — tidak perlu train ulang manual.

---

## 4. training & evaluasi

model terbaik hasil gridsearch langsung dipakai untuk prediksi di data test (20% yang tadi dipisah). dari sini kita dapat metrik seperti accuracy, precision, recall, f1, dan roc auc.

```python
y_pred = rf_model.predict(X_test)
y_pred_proba = rf_model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)
```

selain itu kita juga jalankan **10-fold cross-validation** di seluruh dataset untuk lihat seberapa stabil performa model secara keseluruhan.

```python
skf10 = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
cv_preds = cross_val_score(rf_model, X, y, cv=skf10, scoring='accuracy')
print(f"10-Fold CV Accuracy: {cv_preds.mean():.4f} ± {cv_preds.std():.4f}")
```

---

## 5. simpan model

model beserta semua info pendukungnya (feature columns, best params, metrik, mapping encoding) disimpan ke file `angina_model.pkl` pakai pickle. file ini yang nantinya dibaca oleh `api.py` setiap kali ada request prediksi masuk.

```python
model_data = {
    'model': rf_model,
    'feature_columns': feature_columns,
    'best_params': grid_search.best_params_,
    'metrics': {'accuracy': accuracy, 'f1': f1, ...},
    'preprocessing': {'binary_mapping': binary_mapping, ...}
}

with open('angina_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)
```
