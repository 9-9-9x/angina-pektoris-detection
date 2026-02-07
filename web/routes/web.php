<?php

/*
|-----------------------------------------------------------------------------
| WEB ROUTES - ANGINA PEKTORIS DETECTION APP
|-----------------------------------------------------------------------------
|
| AUTH FLOW:
|   - Root (/) redirects to login if not authenticated
|   - Root (/) redirects to dashboard if authenticated  
|   - All patient/prediction routes require auth
|
| ROUTES:
|   /                    -> Redirect to login or dashboard
|   /login               -> Login page (Fortify)
|   /dashboard           -> Stats & recent predictions
|   /patients/*          -> Patient CRUD
|   /predictions/*       -> Prediction history & results
|
|-----------------------------------------------------------------------------
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PredictionController;

// Public routes - redirect to login if not authenticated
Route::get('/', function () {
    if (auth()->check()) {
        return Inertia::render('home');
    }
    return redirect('/login');
})->name('home');

// About page - accessible when logged in
Route::get('/about', [PredictionController::class, 'about'])
    ->middleware(['auth', 'verified'])
    ->name('about');

// Protected routes - require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard with stats
    Route::get('/dashboard', [PredictionController::class, 'dashboard'])
        ->name('dashboard');
    
    // Classification form (GET)
    Route::get('/classify', [PredictionController::class, 'showClassifyForm'])
        ->name('classify');
    
    // Classification form submission (POST)
    Route::post('/classify', [PredictionController::class, 'classify'])
        ->name('classify.store');
    
    // Classification result
    Route::get('/classify/result', [PredictionController::class, 'result'])
        ->name('classify.result');
    
    // Classification history
    Route::get('/history', [PredictionController::class, 'history'])
        ->name('history');
    
    // Patient management (CRUD)
    Route::resource('patients', PatientController::class);
    
    // Predictions
    Route::get('predictions', [PredictionController::class, 'index'])
        ->name('predictions.index');
    
    Route::get('patients/{patient}/predict', [PredictionController::class, 'create'])
        ->name('predictions.create');
    
    Route::post('patients/{patient}/predict', [PredictionController::class, 'store'])
        ->name('predictions.store');
    
    Route::get('predictions/{prediction}', [PredictionController::class, 'show'])
        ->name('predictions.show');
    
    Route::get('predictions/{prediction}/print', [PredictionController::class, 'print'])
        ->name('predictions.print');
});

require __DIR__.'/settings.php';
