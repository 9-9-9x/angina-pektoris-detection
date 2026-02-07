<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnginaPredictionService
{
    protected string $baseUrl;

    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.ml_api.url', 'http://localhost:8000');
        $this->timeout = config('services.ml_api.timeout', 30);
    }

    /**
     * Check if ML API is healthy
     */
    public function healthCheck(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/health");

            if ($response->successful()) {
                return [
                    'status' => 'healthy',
                    'data' => $response->json(),
                ];
            }

            return [
                'status' => 'unhealthy',
                'error' => 'ML API returned error status',
            ];
        } catch (\Exception $e) {
            Log::error('ML API health check failed: '.$e->getMessage());

            return [
                'status' => 'unreachable',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Predict Angina Pektoris for a patient
     */
    public function predict(array $data): array
    {
        try {
            $formattedData = $this->formatData($data);

            Log::info('Sending prediction request to ML API', $formattedData);

            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/predict", $formattedData);

            if ($response->successful()) {
                $responseData = $response->json();
                Log::info('ML API prediction successful', $responseData);

                return [
                    'success' => true,
                    'data' => $responseData,
                ];
            }

            Log::error('ML API prediction failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => 'Prediction service returned error',
                'details' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('ML API request failed: '.$e->getMessage());

            return [
                'success' => false,
                'error' => 'Failed to connect to prediction service',
                'details' => $e->getMessage(),
            ];
        }
    }

    /**
     * Format data for ML API
     */
    protected function formatData(array $data): array
    {
        return [
            'usia' => (int) $data['umur'],
            'jenis_kelamin' => $data['jenis_kelamin'],
            'TD' => (int) $data['tekanan_darah'],
            'riwayat_DM' => $data['riwayat_dm'],
            'HT' => $data['hipertensi'],
            'riwayat_PJK_terdahulu' => $data['riwayat_pjk'],
            'nyeri_dada_menjalar_ke_lengan' => $data['nyeri_dada'] ?? 'Tidak',
            'durasi_nyeri' => $data['durasi_nyeri'],
            'sesak_napas' => $data['sesak_napas'],
            'mual' => $data['mual'],
            'muntah' => $data['muntah'],
            'keringat_dingin' => $data['keringat_dingin'],
        ];
    }

    /**
     * Get mock prediction result for testing without ML API
     */
    public function mockPredict(array $data): array
    {
        // Simple mock logic based on risk factors
        $riskScore = 0;

        if ($data['nyeri_dada'] === 'Ya') {
            $riskScore += 30;
        }
        if ($data['sesak_napas'] === 'Ya') {
            $riskScore += 20;
        }
        if ($data['keringat_dingin'] === 'Ya') {
            $riskScore += 15;
        }
        if ($data['mual'] === 'Ya') {
            $riskScore += 10;
        }
        if ($data['muntah'] === 'Ya') {
            $riskScore += 10;
        }
        if ($data['hipertensi'] === 'Ya') {
            $riskScore += 10;
        }
        if ($data['riwayat_dm'] === 'Ya') {
            $riskScore += 10;
        }
        if ($data['riwayat_pjk'] === 'Ya') {
            $riskScore += 20;
        }
        if ((int) $data['umur'] > 60) {
            $riskScore += 10;
        }

        $probability = min($riskScore / 100, 0.95);

        $prediction = $probability > 0.5 ? 'Angina Pektoris' : 'Bukan Angina Pektoris';

        if ($probability > 0.7) {
            $riskLevel = 'HIGH';
            $confidence = 'Tinggi';
        } elseif ($probability > 0.4) {
            $riskLevel = 'MODERATE';
            $confidence = 'Sedang';
        } else {
            $riskLevel = 'LOW';
            $confidence = 'Rendah';
        }

        return [
            'success' => true,
            'data' => [
                'prediction' => $prediction,
                'probability_angina' => $probability,
                'risk_level' => $riskLevel,
                'confidence' => $confidence,
                'features_used' => $this->formatData($data),
            ],
        ];
    }
}
