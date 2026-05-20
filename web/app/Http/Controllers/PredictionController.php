<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Prediction;
use App\Services\AnginaPredictionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PredictionController extends Controller
{
    protected AnginaPredictionService $mlService;

    public function __construct(AnginaPredictionService $mlService)
    {
        $this->mlService = $mlService;
    }

    public function index()
    {
        $query = Prediction::with(['patient', 'user'])->latest();

        if (! auth()->user()->isDoctor() && ! auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }

        $predictions = $query->paginate(15);

        return Inertia::render('predictions/index', [
            'predictions' => $predictions,
        ]);
    }

    public function create(Patient $patient)
    {
        $this->authorize('view', $patient);

        // Check ML API health
        $mlStatus = $this->mlService->healthCheck();

        return Inertia::render('predictions/create', [
            'patient' => $patient,
            'mlStatus' => $mlStatus,
        ]);
    }

    /**
     * Store prediction for an existing patient
     */
    public function store(Request $request, Patient $patient)
    {
        $this->authorize('view', $patient);

        $validated = $request->validate([
            'tekanan_darah' => 'required|integer|min:60|max:300',
            'riwayat_dm' => 'required|in:Ya,Tidak',
            'hipertensi' => 'required|in:Ya,Tidak',
            'riwayat_pjk' => 'required|in:Ya,Tidak',
            'nyeri_dada' => 'required|in:Ya,Tidak',
            'durasi_nyeri' => 'required|string',
            'sesak_napas' => 'required|in:Ya,Tidak',
            'mual' => 'required|in:Ya,Tidak',
            'muntah' => 'required|in:Ya,Tidak',
            'keringat_dingin' => 'required|in:Ya,Tidak',
        ]);

        // Prepare data for ML API
        $mlData = [
            'umur' => $patient->umur,
            'jenis_kelamin' => $patient->jenis_kelamin,
            'tekanan_darah' => $validated['tekanan_darah'],
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'nyeri_dada' => $validated['nyeri_dada'],
            'durasi_nyeri' => $validated['durasi_nyeri'],
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
            'keringat_dingin' => $validated['keringat_dingin'],
        ];

        // Call ML API, fall back to mock if unavailable
        $result = $this->mlService->predict($mlData);
        if (! $result['success']) {
            $result = $this->mlService->mockPredict($mlData);
        }

        if (! $result['success']) {
            return redirect()->back()
                ->with('error', 'Gagal melakukan prediksi: '.($result['error'] ?? 'Unknown error'));
        }

        $predictionData = $result['data'];

        // Save prediction to database
        $prediction = Prediction::create([
            'patient_id' => $patient->id,
            'user_id' => auth()->id(),
            'usia' => $patient->umur,
            'jenis_kelamin' => $patient->jenis_kelamin,
            'tekanan_darah' => $validated['tekanan_darah'],
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'nyeri_dada' => $validated['nyeri_dada'],
            'durasi_nyeri' => $validated['durasi_nyeri'],
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
            'keringat_dingin' => $validated['keringat_dingin'],
            'prediction_result' => $predictionData['prediction'],
            'probability_angina' => $predictionData['probability_angina'],
            'risk_level' => $predictionData['risk_level'],
            'confidence' => $predictionData['confidence'],
            'features_used' => $predictionData['features_used'] ?? $mlData,
            'voting_details' => $predictionData['voting_details'] ?? null,
        ]);

        return redirect()->route('predictions.show', $prediction)
            ->with('success', 'Prediksi berhasil dilakukan');
    }

    /**
     * Handle classification form submission from /classify page
     */
    public function classify(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'umur' => 'required|integer|min:0|max:120',
            'jenis_kelamin' => 'required|in:L,P',
            'nyeri_dada' => 'required|in:Ya,Tidak',
            'durasi_nyeri' => 'required|in:<15 menit,>15 menit',
            'sesak_napas' => 'required|in:Ya,Tidak',
            'mual' => 'required|in:Ya,Tidak',
            'muntah' => 'required|in:Ya,Tidak',
            'hipertensi' => 'required|in:Ya,Tidak',
            'riwayat_dm' => 'required|in:Ya,Tidak',
            'riwayat_pjk' => 'required|in:Ya,Tidak',
        ]);

        $mlData = [
            'umur' => $validated['umur'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'durasi_nyeri' => $validated['durasi_nyeri'],
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
        ];

        // Call ML API, fall back to mock if unavailable
        $result = $this->mlService->predict($mlData);
        if (! $result['success']) {
            $result = $this->mlService->mockPredict($mlData);
        }

        if (! $result['success']) {
            return redirect()->back()
                ->with('error', 'Gagal melakukan prediksi: '.($result['error'] ?? 'Unknown error'));
        }

        $predictionData = $result['data'];

        $prediction = DB::transaction(function () use ($validated, $mlData, $predictionData) {
            $patient = Patient::where('nama', $validated['nama'])
                ->where('user_id', auth()->id())
                ->first();

            if (! $patient) {
                $patient = Patient::create([
                    'nama' => $validated['nama'],
                    'no_rm' => Patient::generateNoRm(),
                    'umur' => $validated['umur'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                    'user_id' => auth()->id(),
                ]);
            }

            return Prediction::create([
                'patient_id' => $patient->id,
                'user_id' => auth()->id(),
                'usia' => $validated['umur'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'riwayat_dm' => $validated['riwayat_dm'],
                'hipertensi' => $validated['hipertensi'],
                'riwayat_pjk' => $validated['riwayat_pjk'],
                'nyeri_dada' => $validated['nyeri_dada'],
                'durasi_nyeri' => $validated['durasi_nyeri'],
                'sesak_napas' => $validated['sesak_napas'],
                'mual' => $validated['mual'],
                'muntah' => $validated['muntah'],
                'prediction_result' => $predictionData['prediction'],
                'probability_angina' => $predictionData['probability_angina'],
                'risk_level' => $predictionData['risk_level'],
                'confidence' => $predictionData['confidence'],
                'features_used' => $predictionData['features_used'] ?? $mlData,
                'voting_details' => $predictionData['voting_details'] ?? null,
            ]);
        });

        // Redirect to result page
        return redirect()->route('classify.result', ['prediction' => $prediction->id]);
    }

    /**
     * Show classification result page
     */
    public function result(Request $request)
    {
        $predictionId = $request->query('prediction');

        if ($predictionId) {
            $prediction = Prediction::with('patient')->findOrFail($predictionId);
            $this->authorize('view', $prediction);
        } else {
            // No prediction ID, show empty result page
            return Inertia::render('classification-result', [
                'patient' => null,
                'result' => null,
            ]);
        }

        return Inertia::render('classification-result', [
            'prediction_id' => $prediction->id,
            'patient' => [
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'jenis_kelamin' => $prediction->patient->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
                'durasi_nyeri' => $prediction->durasi_nyeri,
                'tekanan_darah' => $prediction->tekanan_darah.' mmHg',
            ],
            'result' => [
                'prediction' => $prediction->prediction_result,
                'risk_level' => $prediction->risk_level,
                'confidence' => $prediction->risk_percentage,
                'risk_text' => $prediction->risk_text,
            ],
            'voting_details' => $prediction->voting_details,
        ]);
    }

    public function show(Prediction $prediction)
    {
        $this->authorize('view', $prediction);

        $prediction->load(['patient', 'verdictByUser']);

        return Inertia::render('predictions/show', [
            'prediction' => $prediction,
        ]);
    }

    public function print(Prediction $prediction)
    {
        $this->authorize('view', $prediction);

        $prediction->load(['patient', 'user']);

        return Inertia::render('predictions/print', [
            'prediction' => $prediction,
        ]);
    }

    /**
     * Show classification history
     */
    public function history()
    {
        $query = Prediction::with('patient')->latest();

        if (! auth()->user()->isDoctor() && ! auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }

        $predictions = $query->get()->map(function ($prediction) {
            return [
                'id' => $prediction->id,
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'hasil' => $prediction->hasil_klasifikasi,
                'risk_level' => $prediction->risk_level,
                'created_at' => $prediction->created_at->toISOString(),
            ];
        });

        return Inertia::render('classification-history', [
            'classifications' => $predictions,
        ]);
    }

    /**
     * Show about page
     */
    public function about()
    {
        return Inertia::render('about');
    }

    /**
     * Dashboard with stats
     */
    public function dashboard()
    {
        $user = auth()->user();

        $query = Prediction::query();
        $patientQuery = Patient::query();

        if (! $user->isDoctor() && ! $user->isAdmin()) {
            $query->where('user_id', $user->id);
            $patientQuery->where('user_id', $user->id);
        }

        $anginaCount = (clone $query)
            ->where('prediction_result', 'Angina Pektoris')
            ->count();

        $nonAnginaCount = (clone $query)
            ->where('prediction_result', 'Bukan Angina Pektoris')
            ->count();

        $stats = [
            'total_patients' => $patientQuery->count(),
            'angina_count' => $anginaCount,
            'non_angina_count' => $nonAnginaCount,
        ];

        $recentPredictions = (clone $query)
            ->with('patient')
            ->latest()
            ->limit(4)
            ->get()
            ->map(function ($prediction) {
                return [
                    'id' => $prediction->id,
                    'patient' => [
                        'nama' => $prediction->patient->nama,
                        'umur' => $prediction->usia,
                    ],
                    'prediction_result' => $prediction->hasil_klasifikasi,
                    'risk_level' => $prediction->risk_level,
                    'created_at' => $prediction->created_at->toISOString(),
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPredictions' => $recentPredictions,
        ]);
    }

    /**
     * Show classification form
     */
    public function showClassifyForm()
    {
        // Check ML API health for status indicator
        $mlStatus = $this->mlService->healthCheck();

        return Inertia::render('classification', [
            'mlStatus' => $mlStatus,
        ]);
    }
}
