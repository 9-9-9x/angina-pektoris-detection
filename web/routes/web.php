<?php

/*
|-----------------------------------------------------------------------------
| WEB ROUTES - ANGINA PEKTORIS DETECTION APP
|-----------------------------------------------------------------------------
|
| PUBLIC FLOW:
|   - Root (/) shows home page (no auth required)
|   - /about, /classify, /classify/result → public
|   - /skrining/{kode} → public lookup by kode unik
|
| DOCTOR/ADMIN FLOW (login required):
|   - /login → login page (Fortify, redirects to dashboard)
|   - /dashboard → stats & search by kode unik
|   - /history → riwayat (only acc'd predictions)
|   - /patients/* → patient CRUD (doctor/admin only)
|   - /predictions/* → prediction detail & print
|
|-----------------------------------------------------------------------------
*/

use App\Http\Controllers\PatientController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\PredictionVerdictController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    if (auth()->check() && in_array(auth()->user()->role, ['doctor', 'admin'])) {
        return redirect('/dashboard');
    }

    return Inertia::render('home');
})->name('home');

Route::get('/about', [PredictionController::class, 'about'])->name('about');

Route::get('/classify', [PredictionController::class, 'showClassifyForm'])->name('classify');
Route::post('/classify', [PredictionController::class, 'classify'])->name('classify.store');
Route::get('/classify/result', [PredictionController::class, 'result'])->name('classify.result');

// Public lookup by kode unik
Route::get('/skrining', [PredictionController::class, 'showLookupForm'])->name('skrining.lookup');
Route::get('/skrining/{kode}', [PredictionController::class, 'lookupByKode'])->name('skrining.show');

// Public print (patients need this without login)
Route::get('predictions/{prediction}/print', [PredictionController::class, 'print'])
    ->name('predictions.print');

// Protected routes - doctor/admin only
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard with stats (doctor only)
    Route::get('/dashboard', [PredictionController::class, 'dashboard'])
        ->middleware('role:doctor')
        ->name('dashboard');

    // Classification history (acc'd only)
    Route::get('/history', [PredictionController::class, 'history'])
        ->name('history');

    // Patient management (CRUD) — doctor/admin only
    Route::resource('patients', PatientController::class)
        ->middleware('role:doctor,admin');

    // Predictions
    Route::get('predictions', [PredictionController::class, 'index'])
        ->name('predictions.index');

    Route::get('patients/{patient}/predict', [PredictionController::class, 'create'])
        ->name('predictions.create');

    Route::post('patients/{patient}/predict', [PredictionController::class, 'store'])
        ->name('predictions.store');

    Route::get('predictions/{prediction}', [PredictionController::class, 'show'])
        ->name('predictions.show');


    // Doctor verdict on prediction
    Route::post('predictions/{prediction}/verdict', [PredictionVerdictController::class, 'store'])
        ->middleware('role:doctor')
        ->name('predictions.verdict');

    // Admin user management
    Route::middleware('role:admin')->group(function () {
        Route::get('admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
        Route::post('admin/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
        Route::patch('admin/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.update-role');
        Route::delete('admin/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');
    });
});

require __DIR__.'/settings.php';
