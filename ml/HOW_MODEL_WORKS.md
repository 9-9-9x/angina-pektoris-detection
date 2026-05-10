# bagaimana model ini dibuat

## 1. persiapan data

pertama kita baca file `datasetangina.csv` lalu rename beberapa kolom supaya konsisten. baris yang tidak punya label (`Klasifikasi/Label` kosong) langsung dibuang karena tidak bisa dipakai untuk training.

setelah itu kita transformasi kolom-kolom yang masih berbentuk teks atau angka mentah supaya bisa dibaca model:

| kolom asli | bentuk awal | jadi |
|---|---|---|
| Usia | angka tahun (misal 55) | dikelompokkan: <20=0, 20-40=1, 40-60=2, >60=3 |
| Durasi Nyeri | teks `<10 Menit` / `<15 Menit` / `>15 Menit` | 0 / 1 / 2 |
| Riwayat DM, HT, dll | teks `Ya` / `Tidak` | 1 atau 0 |
| Jenis Kelamin | `L` / `P` | 0 atau 1 |
| Klasifikasi/Label | `Angina Pektoris` / `Bukan Angina Pektoris` | 1 atau 0 |

dari semua kolom yang ada, kita pilih 9 kolom sebagai fitur input (X) dan 1 kolom label sebagai target (y).

---

## 2. data siap training

setelah preprocessing selesai, data dibagi jadi **80% training dan 20% testing** secara stratified — artinya proporsi kelas angina vs bukan angina dijaga sama di kedua bagian, supaya tidak timpang.

---

## 3. cari hyperparameter terbaik (gridsearchcv)

sebelum training sungguhan, kita pakai `GridSearchCV` untuk cari kombinasi parameter terbaik dari `RandomForestClassifier`. caranya: kita kasih daftar pilihan nilai untuk tiap parameter, lalu gridsearch mencoba semua kombinasinya satu per satu.

| parameter | pilihan yang dicoba |
|---|---|
| n_estimators | 100, 200, 300 |
| max_depth | 3, 5, None |
| min_samples_leaf | 1, 2 |
| max_features | sqrt, None |
| class_weight | balanced, None |

setiap kombinasi diuji pakai **stratified 5-fold cross-validation** pada data training — data dibagi 5 bagian, model dilatih 5 kali (tiap kali 1 bagian jadi validasi), skornya dirata-rata. kombinasi dengan rata-rata akurasi tertinggi itulah yang dipilih sebagai `best_params`.

---

## 4. training & evaluasi

model terbaik hasil gridsearch langsung dipakai untuk prediksi di data test (20% yang tadi dipisah). dari sini kita dapat metrik seperti accuracy, precision, recall, f1, dan roc auc.

selain itu kita juga jalankan **10-fold cross-validation** di seluruh dataset untuk lihat seberapa stabil performa model secara keseluruhan.

---

## 5. simpan model

model beserta semua info pendukungnya (feature columns, best params, metrik, mapping encoding) disimpan ke file `angina_model.pkl` pakai pickle. file ini yang nantinya dibaca oleh `api.py` setiap kali ada request prediksi masuk.
