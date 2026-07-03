<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Prediction;
use App\Services\AnginaPredictionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PredictionController extends Controller
{
    public function __construct(protected AnginaPredictionService $mlService) {}

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
            'riwayat_dm' => 'required|in:Ya,Tidak',
            'hipertensi' => 'required|in:Ya,Tidak',
            'riwayat_pjk' => 'required|in:Ya,Tidak',
            'nyeri_dada' => 'required|in:Ya,Tidak',
            'durasi_nyeri' => 'required|string',
            'sesak_napas' => 'required|in:Ya,Tidak',
            'mual' => 'required|in:Ya,Tidak',
            'muntah' => 'required|in:Ya,Tidak',
        ]);

        $mlData = [
            'umur' => $patient->umur,
            'jenis_kelamin' => $patient->jenis_kelamin,
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'nyeri_dada' => $validated['nyeri_dada'],
            'durasi_nyeri' => $validated['durasi_nyeri'],
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
        ];

        $result = $this->mlService->predict($mlData);
        if (! $result['success']) {
            $result = $this->mlService->mockPredict($mlData);
        }

        if (! $result['success']) {
            return redirect()->back()
                ->with('error', 'Gagal melakukan prediksi: '.($result['error'] ?? 'Unknown error'));
        }

        $predictionData = $result['data'];

        $prediction = Prediction::create([
            'patient_id' => $patient->id,
            'user_id' => auth()->id(),
            'kode_unik' => $this->generateKodeUnik(),
            'usia' => $patient->umur,
            'jenis_kelamin' => $patient->jenis_kelamin,
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

        return redirect()->route('predictions.show', $prediction)
            ->with('success', 'Prediksi berhasil dilakukan');
    }

    /**
     * Handle classification from /classify (public, no auth)
     */
    public function classify(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'umur' => 'required|integer|min:0|max:120',
            'jenis_kelamin' => 'required|in:L,P',
            'untuk' => 'required|in:diri_sendiri,orang_lain',
            'nyeri_dada' => 'required|in:Ya,Tidak',
            'durasi_nyeri' => 'nullable|required_if:nyeri_dada,Ya|in:<15 menit,>15 menit',
            'sesak_napas' => 'required|in:Ya,Tidak',
            'mual' => 'required|in:Ya,Tidak',
            'muntah' => 'required|in:Ya,Tidak',
            'hipertensi' => 'required|in:Ya,Tidak',
            'riwayat_dm' => 'required|in:Ya,Tidak',
            'riwayat_pjk' => 'required|in:Ya,Tidak',
        ], [
            'nama.required' => 'Nama lengkap wajib diisi.',
            'umur.required' => 'Umur wajib diisi. Pilih tanggal lahir untuk menghitung otomatis.',
            'umur.integer' => 'Umur harus berupa angka.',
            'umur.min' => 'Umur tidak valid.',
            'umur.max' => 'Umur tidak boleh lebih dari 120 tahun.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'untuk.required' => 'Pilih apakah skrining untuk diri sendiri atau orang lain.',
            'nyeri_dada.required' => 'Pilihan nyeri dada wajib diisi.',
            'durasi_nyeri.required_if' => 'Durasi nyeri wajib diisi jika nyeri dada dipilih Ya.',
            'durasi_nyeri.in' => 'Pilih salah satu durasi nyeri yang tersedia.',
            'sesak_napas.required' => 'Pilihan sesak napas wajib diisi.',
            'mual.required' => 'Pilihan mual wajib diisi.',
            'muntah.required' => 'Pilihan muntah wajib diisi.',
            'hipertensi.required' => 'Pilihan riwayat hipertensi wajib diisi.',
            'riwayat_dm.required' => 'Pilihan riwayat diabetes wajib diisi.',
            'riwayat_pjk.required' => 'Pilihan riwayat PJK wajib diisi.',
        ]);

        $mlData = [
            'umur' => $validated['umur'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'riwayat_dm' => $validated['riwayat_dm'],
            'hipertensi' => $validated['hipertensi'],
            'riwayat_pjk' => $validated['riwayat_pjk'],
            'durasi_nyeri' => $validated['durasi_nyeri'] ?? '<15 menit',
            'sesak_napas' => $validated['sesak_napas'],
            'mual' => $validated['mual'],
            'muntah' => $validated['muntah'],
        ];

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
            $patient = Patient::firstOrCreate(
                ['nama' => $validated['nama'], 'user_id' => null],
                [
                    'no_rm' => Patient::generateNoRm(),
                    'umur' => $validated['umur'],
                    'jenis_kelamin' => $validated['jenis_kelamin'],
                ]
            );

            $patient->update([
                'umur' => $validated['umur'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
            ]);

            return Prediction::create([
                'patient_id' => $patient->id,
                'user_id' => null,
                'kode_unik' => $this->generateKodeUnik(),
                'jam_skrining' => now()->format('H:i'),
                'tgl_skrining' => now()->format('Y-m-d'),
                'untuk' => $validated['untuk'],
                'usia' => $validated['umur'],
                'jenis_kelamin' => $validated['jenis_kelamin'],
                'nyeri_dada' => $validated['nyeri_dada'],
                'durasi_nyeri' => $validated['durasi_nyeri'],
                'sesak_napas' => $validated['sesak_napas'],
                'mual' => $validated['mual'],
                'muntah' => $validated['muntah'],
                'riwayat_dm' => $validated['riwayat_dm'],
                'hipertensi' => $validated['hipertensi'],
                'riwayat_pjk' => $validated['riwayat_pjk'],
                'prediction_result' => $predictionData['prediction'],
                'probability_angina' => $predictionData['probability_angina'],
                'risk_level' => $predictionData['risk_level'],
                'confidence' => $predictionData['confidence'],
                'features_used' => $predictionData['features_used'] ?? $mlData,
                'voting_details' => $predictionData['voting_details'] ?? null,
            ]);
        });

        return redirect()->route('classify.result', ['prediction' => $prediction->id]);
    }

    /**
     * Show classification result (public)
     */
    public function result(Request $request)
    {
        $predictionId = $request->query('prediction');

        if (! $predictionId) {
            return Inertia::render('classification-result', [
                'patient' => null,
                'result' => null,
            ]);
        }

        $prediction = Prediction::with('patient')->findOrFail($predictionId);

        return Inertia::render('classification-result', [
            'prediction_id' => $prediction->id,
            'kode_unik' => $prediction->kode_unik,
            'patient' => [
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'jenis_kelamin' => $prediction->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
                'durasi_nyeri' => $prediction->durasi_nyeri,
                'untuk' => $prediction->untuk,
                'jam_skrining' => $prediction->jam_skrining,
                'tgl_skrining' => $prediction->tgl_skrining,
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

    /**
     * Show public lookup form (/skrining)
     */
    public function showLookupForm()
    {
        return Inertia::render('skrining/lookup');
    }

    /**
     * Lookup prediction by kode unik (public)
     */
    public function lookupByKode(string $kode)
    {
        $prediction = Prediction::with('patient')
            ->where('kode_unik', $kode)
            ->first();

        if (! $prediction) {
            return Inertia::render('skrining/lookup', [
                'error' => "Kode \"$kode\" tidak ditemukan. Pastikan kode sudah benar.",
            ]);
        }

        return Inertia::render('skrining/show', [
            'prediction_id' => $prediction->id,
            'kode_unik' => $prediction->kode_unik,
            'patient' => [
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'jenis_kelamin' => $prediction->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
                'untuk' => $prediction->untuk,
                'jam_skrining' => $prediction->jam_skrining,
                'tgl_skrining' => $prediction->tgl_skrining,
            ],
            'result' => [
                'prediction' => $prediction->prediction_result,
                'risk_level' => $prediction->risk_level,
                'confidence' => $prediction->risk_percentage,
                'risk_text' => $prediction->risk_text,
            ],
            'voting_details' => $prediction->voting_details,
            'doctor_verdict' => $prediction->doctor_verdict,
            'doctor_notes' => $prediction->doctor_notes,
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
        $prediction->load(['patient', 'user', 'verdictByUser']);

        return Inertia::render('predictions/print', [
            'prediction' => $prediction,
        ]);
    }

    /**
     * History — doctor/admin sees only acc'd predictions
     */
    public function history()
    {
        $query = Prediction::with('patient')->latest();

        if (auth()->user()->isDoctor() || auth()->user()->isAdmin()) {
            $query->whereNotNull('doctor_verdict');
        }

        $predictions = $query->get()->map(function ($prediction) {
            return [
                'id' => $prediction->id,
                'kode_unik' => $prediction->kode_unik,
                'nama' => $prediction->patient->nama,
                'umur' => $prediction->usia,
                'hasil' => $prediction->hasil_klasifikasi,
                'risk_level' => $prediction->risk_level,
                'doctor_verdict' => $prediction->doctor_verdict,
                'created_at' => $prediction->created_at->toISOString(),
            ];
        });

        return Inertia::render('classification-history', [
            'classifications' => $predictions,
        ]);
    }

    public function about()
    {
        return Inertia::render('about');
    }

    /**
     * Dashboard with stats + search by kode unik
     */
    public function dashboard(Request $request)
    {
        $query = Prediction::query();
        $patientQuery = Patient::query();

        $stats = [
            'total_patients' => $patientQuery->count(),
            'angina_count' => (clone $query)->where('prediction_result', 'Angina Pektoris')->count(),
            'non_angina_count' => (clone $query)->where('prediction_result', 'Bukan Angina Pektoris')->count(),
        ];

        $recentPredictions = (clone $query)
            ->with('patient')
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'kode_unik' => $p->kode_unik,
                'patient' => ['nama' => $p->patient->nama, 'umur' => $p->usia],
                'prediction_result' => $p->hasil_klasifikasi,
                'risk_level' => $p->risk_level,
                'created_at' => $p->created_at->toISOString(),
            ]);

        $searchResult = null;
        if ($request->filled('kode')) {
            $found = Prediction::with('patient')
                ->where('kode_unik', $request->kode)
                ->first();

            if ($found) {
                $searchResult = [
                    'id' => $found->id,
                    'kode_unik' => $found->kode_unik,
                    'patient' => [
                        'nama' => $found->patient->nama,
                        'umur' => $found->usia,
                        'jenis_kelamin' => $found->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
                    ],
                    'prediction_result' => $found->prediction_result,
                    'risk_level' => $found->risk_level,
                    'risk_text' => $found->risk_text,
                    'doctor_verdict' => $found->doctor_verdict,
                    'created_at' => $found->created_at->toISOString(),
                ];
            }
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPredictions' => $recentPredictions,
            'searchResult' => $searchResult,
            'searchKode' => $request->kode,
        ]);
    }

    public function showClassifyForm()
    {
        $mlStatus = $this->mlService->healthCheck();

        return Inertia::render('classification', [
            'mlStatus' => $mlStatus,
        ]);
    }

    private function generateKodeUnik(): string
    {
        do {
            $kode = strtoupper(Str::random(3)).'-'.strtoupper(Str::random(4)).'-'.strtoupper(Str::random(3));
        } while (Prediction::where('kode_unik', $kode)->exists());

        return $kode;
    }
}
