<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::withCount('predictions')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('patients/index', [
            'patients' => $patients,
        ]);
    }

    public function create()
    {
        return Inertia::render('patients/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'umur' => 'required|integer|min:0|max:120',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['no_rm'] = Patient::generateNoRm();

        $patient = Patient::create($validated);

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Pasien berhasil ditambahkan');
    }

    public function show(Patient $patient)
    {
        $this->authorize('view', $patient);

        $patient->load(['predictions' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
        ]);
    }

    public function edit(Patient $patient)
    {
        $this->authorize('update', $patient);

        return Inertia::render('patients/edit', [
            'patient' => $patient,
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $this->authorize('update', $patient);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'umur' => 'required|integer|min:0|max:120',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:20',
        ]);

        $patient->update($validated);

        return redirect()->route('patients.show', $patient)
            ->with('success', 'Data pasien berhasil diperbarui');
    }

    public function destroy(Patient $patient)
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return redirect()->route('patients.index')
            ->with('success', 'Pasien berhasil dihapus');
    }
}
