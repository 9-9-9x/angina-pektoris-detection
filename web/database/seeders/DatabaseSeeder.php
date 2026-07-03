<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\Prediction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic medical data.
     */
    public function run(): void
    {
        $usersData = [
            [
                'name' => 'Admin',
                'email' => 'admin@rsud.go.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'dr. Ahmad Susanto',
                'email' => 'dr.ahmad@rsud.go.id',
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'dr. Sarah Wijaya',
                'email' => 'dr.sarah@rsud.go.id',
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'dr. Budi Santoso',
                'email' => 'dr.budi@rsud.go.id',
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Demo Pasien',
                'email' => 'demo@example.com',
                'password' => Hash::make('password'),
                'role' => 'patient',
                'email_verified_at' => now(),
            ],
        ];

        $createdUsers = [];
        foreach ($usersData as $userData) {
            $createdUsers[] = User::create($userData);
        }

        $ahmad = User::where('email', 'dr.ahmad@rsud.go.id')->first();
        $demoUser = User::where('email', 'demo@example.com')->first();

        // Doctors get full patient data
        $this->seedPatientsAndPredictions($ahmad);
        $this->seedPatientsAndPredictions(User::where('email', 'dr.sarah@rsud.go.id')->first());

        // Patient demo only gets their own single record
        $this->seedPatientOwnRecord($demoUser);

        $this->command->info('Database seeded successfully!');
        $this->command->newLine();
        $this->command->info('=== Akun yang tersedia ===');
        foreach ($createdUsers as $user) {
            $role = match ($user->role) {
                'admin' => 'Admin',
                'doctor' => 'Dokter',
                'patient' => 'Pasien',
                default => $user->role,
            };
            $this->command->line("  [{$role}] {$user->name} | {$user->email} | password");
        }
        $this->command->newLine();
    }

    private function seedPatientsAndPredictions(User $user): void
    {
        // Sample patient data with realistic medical profiles
        $patients = [
            [
                'nama' => 'Tn. Muhammad Taufiq',
                'umur' => 75,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Ya',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '45 Menit',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Ya',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.92,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Ny. Siti Aminah',
                'umur' => 68,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '30 Menit',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.85,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Tn. Rudi Santoso',
                'umur' => 60,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '20 Menit',
                        'sesak_napas' => 'Tidak',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.65,
                        'risk_level' => 'MODERATE',
                        'confidence' => 'Sedang',
                    ],
                ],
            ],
            [
                'nama' => 'Ny. Husnul Awaliyah',
                'umur' => 78,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Ya',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '1 Jam',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Ya',
                        'muntah' => 'Ya',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.95,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Ny. Ngatemi',
                'umur' => 80,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '15 Menit',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Ya',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.72,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Nn. Rini Amalia',
                'umur' => 19,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Tidak',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Tidak',
                        'durasi_nyeri' => '5 Menit',
                        'sesak_napas' => 'Tidak',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Bukan Angina Pektoris',
                        'probability_angina' => 0.12,
                        'risk_level' => 'LOW',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Tn. Suroso',
                'umur' => 65,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '40 Menit',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.78,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Ny. Sutinah',
                'umur' => 75,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Tidak',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Tidak',
                        'durasi_nyeri' => '10 Menit',
                        'sesak_napas' => 'Tidak',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Bukan Angina Pektoris',
                        'probability_angina' => 0.08,
                        'risk_level' => 'LOW',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Tn. Darma Zakaria',
                'umur' => 60,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Tidak',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '5 Menit',
                        'sesak_napas' => 'Tidak',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Bukan Angina Pektoris',
                        'probability_angina' => 0.25,
                        'risk_level' => 'LOW',
                        'confidence' => 'Sedang',
                    ],
                ],
            ],
            [
                'nama' => 'Tn. Agus Wibowo',
                'umur' => 72,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Ya',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '2 Jam',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Ya',
                        'muntah' => 'Ya',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.98,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
            [
                'nama' => 'Ny. Mulyani',
                'umur' => 55,
                'jenis_kelamin' => 'P',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Tidak',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Tidak',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '25 Menit',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Tidak',
                        'muntah' => 'Tidak',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.58,
                        'risk_level' => 'MODERATE',
                        'confidence' => 'Sedang',
                    ],
                ],
            ],
            [
                'nama' => 'Tn. Slamet Riyadi',
                'umur' => 82,
                'jenis_kelamin' => 'L',
                'predictions' => [
                    [
                        'riwayat_dm' => 'Ya',
                        'hipertensi' => 'Ya',
                        'riwayat_pjk' => 'Ya',
                        'nyeri_dada' => 'Ya',
                        'durasi_nyeri' => '1.5 Jam',
                        'sesak_napas' => 'Ya',
                        'mual' => 'Ya',
                        'muntah' => 'Ya',
                        'prediction_result' => 'Angina Pektoris',
                        'probability_angina' => 0.96,
                        'risk_level' => 'HIGH',
                        'confidence' => 'Tinggi',
                    ],
                ],
            ],
        ];

        foreach ($patients as $patientData) {
            $predictions = $patientData['predictions'];
            unset($patientData['predictions']);

            $patient = Patient::create([
                ...$patientData,
                'no_rm' => Patient::generateNoRm(),
                'user_id' => $user->id,
            ]);

            foreach ($predictions as $predictionData) {
                Prediction::create([
                    ...$predictionData,
                    'patient_id' => $patient->id,
                    'user_id' => $user->id,
                    'usia' => $patient->umur,
                    'jenis_kelamin' => $patient->jenis_kelamin,
                    'features_used' => $predictionData,
                ]);
            }
        }
    }

    private function seedPatientOwnRecord(User $user): void
    {
        $patient = Patient::create([
            'nama' => $user->name,
            'umur' => 35,
            'jenis_kelamin' => 'L',
            'no_rm' => Patient::generateNoRm(),
            'user_id' => $user->id,
        ]);

        Prediction::create([
            'patient_id' => $patient->id,
            'user_id' => $user->id,
            'usia' => 35,
            'jenis_kelamin' => 'L',
            'riwayat_dm' => 'Tidak',
            'hipertensi' => 'Tidak',
            'riwayat_pjk' => 'Tidak',
            'nyeri_dada' => 'Ya',
            'durasi_nyeri' => '10 Menit',
            'sesak_napas' => 'Tidak',
            'mual' => 'Tidak',
            'muntah' => 'Tidak',
            'prediction_result' => 'Bukan Angina Pektoris',
            'probability_angina' => 0.18,
            'risk_level' => 'LOW',
            'confidence' => 'Tinggi',
            'features_used' => [],
        ]);
    }
}
