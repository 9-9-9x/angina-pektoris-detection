<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Prediction;
use App\Services\AnginaPredictionService;
use Illuminate\Http\Request;
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
        $predictions = Prediction::with(['patient', 'user'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(15);

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

    public function store(Request $request, Patient $patient)
    {
        $this->authorize('view', $patient);

        $validated = $request->validate([
            'usia' => 'required|integer|min:0|max:120',
            'tekanan_darah' => 'required|integer|min:60|max:300',
            'riwayat_dm' => 'required|in:Ya,Tidak',
            'hipertensi' => 'required|in:Ya,Tidak',
            'riwayat_pjk' => 'required|in:Ya,Tidak',
            'nyeri_menjalar' => 'required|in:Ya,Tidak',
            'durasi_nyeri' => 'required|string',
            'sesak_napas' => 'required|in:Ya,Tidak',
            'mual' => 'required|in:Ya,Tidak',
            'muntah' => 'required|in:Ya,Tidak',
            'keringat_dingin' => 'required|in:Ya,Tidak',
        ]);

        // Call ML API
        $result = $this->mlService->predict($validated);

        if (!$result['success']) {
            return redirect()->back()
                ->with('error', 'Gagal melakukan prediksi: ' . ($result['error'] ?? 'Unknown error'));
        }

        $predictionData = $result['data'];

        // Save prediction to database
        $prediction = Prediction::create([
            'patient_id' => $patient->id,
            'user_id' => auth()->id(),
            'usia' => $validated['usia'],
            'tekanan_darah' => $validated['tekanan_darah'],
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'nyeri_menjalar' => $validated['nyeri_menjalar'],
            'durasi_nyeri' => $validated['durasi_nyeri'],
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
            'keringat_dingin' => $validated['keringat_dingin'],
            'prediction_result' => $predictionData['prediction'],
            'probability_angina' => $predictionData['probability_angina'],
            'risk_level' => $predictionData['risk_level'],
            'confidence' => $predictionData['confidence'],
            'features_used' => $predictionData['features_used'] ?? null,
        ]);

        return redirect()->route('predictions.show', $prediction)
            ->with('success', 'Prediksi berhasil dilakukan');
    }

    public function show(Prediction $prediction)
    {
        $this->authorize('view', $prediction);

        $prediction->load('patient');

        return Inertia::render('predictions/show', [
            'prediction' => $prediction,
        ]);
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        $stats = [
            'total_patients' => Patient::where('user_id', $user->id)->count(),
            'total_predictions' => Prediction::where('user_id', $user->id)->count(),
            'today_predictions' => Prediction::where('user_id', $user->id)
                ->whereDate('created_at', today())
                ->count(),
            'high_risk_count' => Prediction::where('user_id', $user->id)
                ->where('risk_level', 'HIGH')
                ->count(),
        ];

        $recentPredictions = Prediction::with('patient')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        $riskDistribution = Prediction::where('user_id', $user->id)
            ->selectRaw('risk_level, COUNT(*) as count')
            ->groupBy('risk_level')
            ->pluck('count', 'risk_level')
            ->toArray();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPredictions' => $recentPredictions,
            'riskDistribution' => $riskDistribution,
        ]);
    }
}
