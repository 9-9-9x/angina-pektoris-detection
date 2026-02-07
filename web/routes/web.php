<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PredictionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [PredictionController::class, 'dashboard'])->name('dashboard');
    
    // Patients
    Route::resource('patients', PatientController::class);
    
    // Predictions
    Route::get('predictions', [PredictionController::class, 'index'])->name('predictions.index');
    Route::get('patients/{patient}/predict', [PredictionController::class, 'create'])->name('predictions.create');
    Route::post('patients/{patient}/predict', [PredictionController::class, 'store'])->name('predictions.store');
    Route::get('predictions/{prediction}', [PredictionController::class, 'show'])->name('predictions.show');
});

require __DIR__.'/settings.php';
