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
            Log::error('ML API health check failed: ' . $e->getMessage());
            
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
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/predict", $this->formatData($data));

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
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
            Log::error('ML API request failed: ' . $e->getMessage());

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
            'usia' => (int) $data['usia'],
            'jenis_kelamin' => $data['jenis_kelamin'],
            'TD' => (int) $data['tekanan_darah'],
            'riwayat_DM' => $data['riwayat_dm'],
            'HT' => $data['hipertensi'],
            'riwayat_PJK_terdahulu' => $data['riwayat_pjk'],
            'nyeri_dada_menjalar_ke_lengan' => $data['nyeri_menjalar'],
            'durasi_nyeri' => $data['durasi_nyeri'],
            'sesak_napas' => $data['sesak_napas'],
            'mual' => $data['mual'],
            'muntah' => $data['muntah'],
            'keringat_dingin' => $data['keringat_dingin'],
        ];
    }
}
