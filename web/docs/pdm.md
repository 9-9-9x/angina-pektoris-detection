# PDM (Physical Data Model)

## Tabel users

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | NOT NULL | Nama user |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email login |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM('patient','doctor','admin') | NOT NULL, DEFAULT 'patient' | Role user |
| email_verified_at | TIMESTAMP | NULL | Verifikasi email |
| two_factor_secret | TEXT | NULL | 2FA secret |
| two_factor_recovery_codes | TEXT | NULL | 2FA recovery codes |
| two_factor_confirmed_at | TIMESTAMP | NULL | 2FA konfirmasi |
| remember_token | VARCHAR(100) | NULL | Remember me token |
| created_at | TIMESTAMP | NULL | Tanggal dibuat |
| updated_at | TIMESTAMP | NULL | Tanggal diupdate |

## Tabel patients

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| nama | VARCHAR(255) | NOT NULL | Nama pasien |
| no_rm | VARCHAR(255) | UNIQUE, NULLABLE | Nomor urut pasien |
| umur | INTEGER | NOT NULL | Umur pasien (0-120) |
| jenis_kelamin | ENUM('L','P') | NOT NULL | Jenis kelamin |
| alamat | TEXT | NULL | Alamat pasien |
| telepon | VARCHAR(20) | NULL | Nomor telepon |
| user_id | BIGINT | FK → users.id, ON DELETE CASCADE | User yang membuat |
| created_at | TIMESTAMP | NULL | Tanggal dibuat |
| updated_at | TIMESTAMP | NULL | Tanggal diupdate |

## Tabel predictions

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| patient_id | BIGINT | FK → patients.id, ON DELETE CASCADE, NOT NULL | Pasien terkait |
| user_id | BIGINT | FK → users.id, ON DELETE CASCADE, NOT NULL | User yang mengklasifikasi |
| usia | INTEGER | NOT NULL | Usia saat prediksi |
| jenis_kelamin | ENUM('L','P') | NOT NULL | Jenis kelamin pasien |
| tekanan_darah | INTEGER | NOT NULL | Tekanan darah sistolik (mmHg) |
| riwayat_dm | ENUM('Ya','Tidak') | NOT NULL | Riwayat diabetes mellitus |
| hipertensi | ENUM('Ya','Tidak') | NOT NULL | Riwayat hipertensi |
| riwayat_pjk | ENUM('Ya','Tidak') | NOT NULL | Riwayat penyakit jantung koroner |
| nyeri_dada | ENUM('Ya','Tidak') | NOT NULL | Apakah mengalami nyeri dada |
| durasi_nyeri | VARCHAR(255) | NOT NULL | Durasi nyeri dada |
| sesak_napas | ENUM('Ya','Tidak') | NOT NULL | Apakah sesak napas |
| mual | ENUM('Ya','Tidak') | NOT NULL | Apakah mual |
| muntah | ENUM('Ya','Tidak') | NOT NULL | Apakah muntah |
| keringat_dingin | ENUM('Ya','Tidak') | NOT NULL | Apakah keringat dingin |
| prediction_result | VARCHAR(255) | NOT NULL | Hasil: Angina Pektoris / Bukan |
| probability_angina | DECIMAL(5,4) | NOT NULL | Probabilitas angina (0.0000-1.0000) |
| risk_level | ENUM('LOW','MODERATE','HIGH') | NOT NULL | Level risiko |
| confidence | VARCHAR(255) | NOT NULL | Confidence score ML |
| features_used | JSON | NULL | Fitur yang diproses ML |
| doctor_verdict | ENUM('Angina Pektoris','Bukan Angina Pektoris','Perlu Pemeriksaan Lanjut') | NULL | Verdict dokter |
| doctor_notes | TEXT | NULL | Catatan dokter |
| verdict_by | BIGINT | FK → users.id, ON DELETE SET NULL, NULL | Dokter yang memberi verdict |
| verdict_at | TIMESTAMP | NULL | Waktu verdict |
| created_at | TIMESTAMP | NULL | Tanggal dibuat |
| updated_at | TIMESTAMP | NULL | Tanggal diupdate |

## Relasi

| Dari | Ke | Tipe | Keterangan |
|------|----|------|------------|
| users.id | patients.user_id | One-to-Many | Satu user bisa membuat banyak pasien |
| patients.id | predictions.patient_id | One-to-Many | Satu pasien bisa punya banyak prediksi |
| users.id | predictions.user_id | One-to-Many | Satu user bisa membuat banyak prediksi |
| users.id | predictions.verdict_by | One-to-Many | Satu dokter bisa memberi verdict banyak prediksi |
