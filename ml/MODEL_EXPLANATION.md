# Laporan Evaluasi Model Deteksi Angina Pektoris
## Dokumen untuk Klien - Penjelasan Detail Performa Model

---

## 📋 Ringkasan Eksekutif

Model Random Forest yang dikembangkan untuk deteksi Angina Pektoris telah diuji dan menghasilkan **akurasi 57%** pada data uji. Meskipun model ini menunjukkan potensi, **terdapat kelemahan kritis** yang harus diperbaiki sebelum dapat digunakan dalam praktik medis nyata.

**Status: BELUM SIAP DEPLOYMENT** ⚠️

---

## 1. PEMBAHASAN CONFUSION MATRIX (Matriks Kebingungan)

### Apa itu Confusion Matrix?

Confusion Matrix adalah tabel yang menunjukkan **perbandingan antara prediksi model dengan kenyataan sebenarnya**. Ini seperti "rapor" yang menunjukkan seberapa sering model benar dan salah.

### Hasil pada Data Uji (7 Pasien)

```
                        PREDIKSI MODEL
                     ┌──────────────────┐
                     │  Bukan   │       │
                     │  Angina  │ Angina│
    ┌────────────────┼──────────┼───────┤
K   │ Bukan Angina   │    1     │   2   │ ← 3 pasien sehat
E   │ (Aktual: 3)    │   (TN)   │  (FP) │
N   ├────────────────┼──────────┼───────┤
Y   │ Angina         │    1     │   3   │ ← 4 pasien sakit
A   │ (Aktual: 4)    │   (FN)   │  (TP) │
T   └────────────────┴──────────┴───────┘
A
A
```

### Penjelasan Setiap Kotak:

#### A. TRUE NEGATIVE (TN) = 1 pasien ✅
- **Kondisi**: Pasien sehat, model memprediksi sehat
- **Arti**: Model benar mengidentifikasi pasien tidak menderita Angina
- **Dampak klinis**: Positif - pasien tidak diberikan pengobatan yang tidak perlu

#### B. FALSE POSITIVE (FP) = 2 pasien ⚠️
- **Kondisi**: Pasien sehat, TETAPI model memprediksi sakit Angina
- **Arti**: "False Alarm" - model "mengecek" padahal pasien baik-baik saja
- **Dampak klinis**:
  - Pasien mengalami kecemasan yang tidak perlu
  - Biaya tambahan untuk pemeriksaan lanjutan
  - Beban pada sistem kesehatan
  - Namun, **tidak berbahaya secara medis**

#### C. FALSE NEGATIVE (FN) = 1 pasien 🚨 **KRITIS**
- **Kondisi**: Pasien SAKIT Angina, TETAPI model memprediksi sehat
- **Arti**: Model **MELEWATKAN** diagnosis penyakit
- **Dampak klinis - SANGAT BERBAHAYA**:
  - Pasien tidak mendapatkan pengobatan yang diperlukan
  - Kondisi dapat memburuk tanpa pengawasan medis
  - Risiko serangan jantung (MI) meningkat
  - Potensi kematian yang bisa dicegah
  - **Ini adalah kesalahan paling berbahaya dalam diagnosis**

#### D. TRUE POSITIVE (TP) = 3 pasien ✅
- **Kondisi**: Pasien sakit, model memprediksi sakit
- **Arti**: Model benar mendeteksi Angina Pektoris
- **Dampak klinis**: Positif - pasien mendapatkan pengobatan tepat waktu

---

## 2. METRIK PERFORMA DARI CONFUSION MATRIX

### A. Akurasi (Accuracy) = 57%
**Rumus**: (TP + TN) / Total = (3 + 1) / 7 = 57%

**Arti**: Dari 7 pasien yang diuji, model benar menebak 4 pasien.

**Interpretasi**:
- Ini hanya **sedikit lebih baik dari tebak koin (50%)**
- Dalam konteks medis, akurasi < 80% umumnya dianggap tidak memadai
- **Bukan metrik terbaik** untuk data tidak seimbang (lebih banyak pasien sakit)

### B. Sensitivitas / Recall = 75%
**Rumus**: TP / (TP + FN) = 3 / (3 + 1) = 75%

**Arti**: Dari 4 pasien Angina yang sebenarnya, model berhasil menemukan 3.

**Interpretasi Medis**:
- **25% pasien Angina TIDAK TERDETEKSI**
- Ini berarti **1 dari 4 pasien** akan pulang dengan diagnosis "sehat" padahal membutuhkan pengobatan
- Dalam istilah medis: **False Negative Rate = 25%**
- **Standar medis**: Untuk penyakit serius seperti Angina, sensitivitas harus > 90%

### C. Spesifisitas = 33%
**Rumus**: TN / (TN + FP) = 1 / (1 + 2) = 33%

**Arti**: Dari 3 pasien sehat, model hanya benar mengidentifikasi 1.

**Interpretasi Medis**:
- **67% pasien sehat diberitahu mungkin sakit**
- Banyak "false alarm" yang menyebabkan kecemasan dan biaya tidak perlu
- **Standar medis**: Spesifisitas idealnya > 85%

### D. Presisi / Positive Predictive Value (PPV) = 60%
**Rumus**: TP / (TP + FP) = 3 / (3 + 2) = 60%

**Arti**: Dari 5 kali model memprediksi "Angina", hanya 3 yang benar.

**Interpretasi Medis**:
- Jika model mengatakan "Anda mungkin memiliki Angina", kemungkinan benar hanya 60%
- 40% kasus akan memerlukan pemeriksaan lanjutan yang ternyata negatif

### E. Negative Predictive Value (NPV) = 50%
**Rumus**: TN / (TN + FN) = 1 / (1 + 1) = 50%

**Arti**: Dari 2 kali model memprediksi "Tidak Angina", 1 ternyata salah.

**Interpretasi Medis**:
- Jika model mengatakan "Anda aman", kemungkinan benar hanya 50%
- **Setengah dari pasien yang dinyatakan sehat sebenarnya sakit!**

---

## 3. PEMBAHASAN ROC CURVE & AUC

### Apa itu ROC Curve?

ROC (Receiver Operating Characteristic) adalah grafik yang menunjukkan **kemampuan model membedakan** antara dua kelas:
- Angina Pektoris (positif)
- Bukan Angina Pektoris (negatif)

### Membaca Grafik ROC

**Sumbu X (False Positive Rate)**: Seberapa sering model salah mengatakan "sakit" pada pasien sehat
**Sumbu Y (True Positive Rate/Sensitivitas)**: Seberapa sering model benar mengatakan "sakit" pada pasien sakit

### Garis pada Grafik:

1. **Garis Biru Putus-putus (Random Classifier)**
   - Ini adalah garis "tebakan acak"
   - Jika model ada di sini, sama saja dengan melempar koin
   - AUC = 0.5

2. **Garis Oranye (ROC Curve Model Kita)**
   - Menunjukkan performa aktual model
   - Semakin menjauh dari garis biru, semakin baik
   - Model kita berada DI ATAS garis acak (artinya lebih baik dari tebakan)

### AUC (Area Under Curve) = 0.75

**Apa itu AUC?**
AUC adalah angka antara 0 dan 1 yang mengukur **kemampuan keseluruhan model membedakan kelas**.

**Skala Interpretasi AUC**:

| AUC | Interpretasi | Kelayakan Medis |
|-----|--------------|-----------------|
| 0.90 - 1.00 | Sangat Baik | ✅ Sangat Baik |
| 0.80 - 0.90 | Baik | ✅ Dapat Diterima |
| **0.70 - 0.80** | **Cukup** | ⚠️ **Perlu Perbaikan** |
| 0.60 - 0.70 | Kurang | ❌ Tidak Memadai |
| 0.50 - 0.60 | Sangat Kurang | ❌ Tidak Berguna |
| < 0.50 | Lebih buruk dari acak | ❌ Berbahaya |

**AUC Model Kita = 0.75**
- Berada di kategori "Cukup"
- Model memiliki **75% kemungkinan** memberi skor lebih tinggi pada pasien Angina dibanding pasien sehat
- **Cukup untuk riset, tetapi TIDAK CUKUP untuk diagnosis klinis**

---

## 4. ANALISIS FITUR (FEATURE IMPORTANCE)

Berdasarkan analisis model, berikut adalah faktor-faktor yang paling berpengaruh dalam mendeteksi Angina:

| Peringkat | Fitur | Importance | Interpretasi Klinis |
|-----------|-------|------------|---------------------|
| 1 | TD_Binned (Tekanan Darah) | 18.5% | Tekanan darah adalah prediktor terkuat |
| 2 | Nyeri dada menjalar ke lengan | 15.7% | Gejala klasik Angina |
| 3 | Riwayat DM (Diabetes) | 14.5% | DM meningkatkan risiko PJK |
| 4 | HT (Hipertensi) | 9.9% | Faktor risiko kardiovaskular |
| 5 | Usia_Binned | 9.3% | Risiko meningkat dengan usia |
| 6 | Muntah | 9.1% | Gejala atipikal |
| 7 | Jenis Kelamin | 9.0% | Perbedaan gender dalam risiko |
| 8 | Riwayat PJK terdahulu | 7.0% | Riwayat penyakit sebelumnya |
| 9 | Keringat dingin | 6.9% | Gejala akut |
| 10 | Durasi Nyeri | 0% | ⚠️ **Data tidak bervariasi** |
| 11 | Sesak napas | 0% | ⚠️ **Perlu investigasi** |
| 12 | Mual | 0% | ⚠️ **Selalu "Ya" di dataset** |

### Catatan Penting tentang Fitur:

**Fitur Bermasalah:**
1. **Mual**: 100% pasien dalam dataset memiliki nilai "Ya"
   - Model tidak bisa belajar dari fitur ini
   - Perlu data yang lebih beragam

2. **Durasi Nyeri**: Semua pasien memiliki durasi >10 menit
   - Tidak ada variasi untuk dipelajari model
   - Perlu pasien dengan durasi nyeri bervariasi

---

## 5. KELEMAHAN KRITIS YANG HARUS DIPERBAIKI

### A. Ukuran Dataset Terlalu Kecil

**Situasi Saat Ini:**
- Total pasien: 32
- Data training: 25 pasien
- Data testing: 7 pasien

**Mengapa Ini Masalah:**
1. **Statistik tidak reliable**: Dengan hanya 7 pasien uji, hasil bisa berubah drastis jika 1-2 pasien diganti
2. **Overfitting**: Model "menghafal" daripada "belajar pola"
3. **Variansi tinggi**: Performa bisa sangat berbeda pada data baru

**Rekomendasi:**
- Minimum untuk model medis: **500 pasien**
- Ideal untuk model diagnosis: **1000+ pasien**

### B. Data Tidak Seimbang (Imbalanced)

**Distribusi:**
- Angina Pektoris: 20 pasien (62.5%)
- Bukan Angina: 12 pasien (37.5%)

**Dampak:**
- Model cenderung "menebak" Angina lebih sering
- Bisa menyebabkan bias dalam prediksi

### C. False Negative Rate yang Tinggi (25%)

**Implikasi Medis:**
- Setiap 4 pasien Angina, 1 akan terlewat
- Jika digunakan di rumah sakit dengan 100 pasien Angina per bulan:
  - **25 pasien akan dipulangkan tanpa pengobatan**
  - Potensi konsekuensi fatal

**Perbandingan Standar Medis:**
- Model saat ini: 25% miss rate
- Standar gold standard (EKG + Troponin): <2% miss rate
- Target minimum untuk AI medis: <5% miss rate

---

## 6. REKOMENDASI UNTUK KLIEN

### Jangka Pendek (1-2 Bulan)

1. **Jangan deploy model ke produksi**
   - Risiko keselamatan pasien terlalu tinggi
   - Gunakan hanya untuk riset/penelitian

2. **Kumpulkan lebih banyak data**
   - Target minimum: 200 pasien untuk validasi awal
   - Pastikan variasi dalam gejala (terutama Durasi Nyeri dan Mual)

3. **Perbaiki keseimbangan data**
   - Usahakan rasio 50:50 antara Angina dan Non-Angina
   - Atau gunakan teknik sampling khusus

### Jangka Menengah (3-6 Bulan)

1. **Validasi dengan data eksternal**
   - Uji model di rumah sakit berbeda
   - Pastikan model bekerja di berbagai populasi

2. **Implementasi ensemble model**
   - Gabungkan dengan model lain (XGBoost, Neural Network)
   - Tingkatkan akurasi dan keandalan

3. **Tambahkan fitur klinis**
   - Hasil EKG (Elektrokardiogram)
   - Level Troponin (penanda kerusakan otot jantung)
   - Profil lipid (kolesterol)

### Jangka Panjang (6-12 Bulan)

1. **Validasi klinis formal**
   - Uji retrospektif pada 500+ kasus
   - Bandingkan dengan diagnosis dokter spesialis

2. **Regulasi dan sertifikasi**
   - Sesuaikan dengan regulasi Alkes di Indonesia
   - Dapatkan sertifikasi jika diperlukan

3. **Implementasi bertahap**
   - Mulai sebagai "alat bantu" (decision support), bukan diagnosis utama
   - Dokter tetap membuat keputusan akhir

---

## 7. KESIMPULAN

### Hasil Positif ✅
1. Model berhasil di-train tanpa error teknis
2. AUC 0.75 menunjukkan model memiliki kemampuan diskriminasi dasar
3. Feature importance sesuai dengan pengetahuan medis (TD, nyeri menjalar, riwayat DM)
4. Model dapat disimpan dan digunakan untuk prediksi baru

### Hasil Negatif yang Perlu Diperbaiki ⚠️
1. **Akurasi 57% terlalu rendah** untuk diagnosis medis
2. **25% miss rate (False Negative) berbahaya untuk pasien**
3. **Dataset hanya 32 pasien** - terlalu kecil untuk generalisasi
4. **Beberapa fitur tidak bervariasi** (Mual selalu "Ya")

### Pernyataan Profesional untuk Klien

> "Model yang dikembangkan menunjukkan **potensi dasar** untuk deteksi Angina Pektoris, dengan kemampuan membedakan pasien sakit dan sehat di tingkat **cukup (AUC 0.75)**. Namun, dengan **tingkat miss 25%** dan hanya diuji pada **7 pasien**, model ini **BELUM LAYAK** digunakan dalam praktik klinis.
>
> Kami merekomendasikan pengumpulan data minimal **500 pasien** dengan variasi gejala yang baik sebelum model dapat dipertimbangkan untuk deployment. Model saat ini cocok digunakan sebagai **prototipe riset**, bukan alat diagnosis."

---

## 8. GLOSARIUM (Istilah Teknis)

| Istilah | Penjelasan Sederhana |
|---------|---------------------|
| **Confusion Matrix** | Tabel yang menunjukkan berapa kali model benar/salah |
| **True Positive** | Model benar: pasien sakit, diprediksi sakit |
| **True Negative** | Model benar: pasien sehat, diprediksi sehat |
| **False Positive** | Model salah: pasien sehat, diprediksi sakit (false alarm) |
| **False Negative** | Model salah: pasien sakit, diprediksi sehat (terlewat) |
| **Sensitivitas/Recall** | Kemampuan menemukan pasien yang sakit |
| **Spesifisitas** | Kemampuan mengidentifikasi pasien yang sehat |
| **Presisi** | Akurasi prediksi positif (jika model bilang sakit, seberapa yakin?) |
| **AUC-ROC** | Ukuran kemampuan model membedakan sakit vs sehat (0-1) |
| **Overfitting** | Model terlalu "menghafal" data latih, tidak bisa generalisasi |
| **Cross-Validation** | Metode uji model dengan membagi data beberapa kali |

---

**Dokumen ini disusun untuk membantu klien memahami kondisi model saat ini dan langkah-langkah yang diperlukan untuk pengembangan selanjutnya.**

*Dibuat oleh: Tim Data Science*  
*Tanggal: 7 Februari 2026*
