<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionVerdictController extends Controller
{
    public function store(Request $request, Prediction $prediction)
    {
        $this->authorize('addVerdict', $prediction);

        $validated = $request->validate([
            'doctor_verdict' => 'required|in:Angina Pektoris,Bukan Angina Pektoris,Perlu Pemeriksaan Lanjut',
            'doctor_notes' => 'nullable|string|max:1000',
        ]);

        $prediction->update([
            'doctor_verdict' => $validated['doctor_verdict'],
            'doctor_notes' => $validated['doctor_notes'],
            'verdict_by' => auth()->id(),
            'verdict_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Verdict berhasil disimpan');
    }
}
