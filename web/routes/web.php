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

use App\Http\Controllers\PatientController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\PredictionVerdictController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    // Dashboard with stats (admin only)
    Route::get('/dashboard', [PredictionController::class, 'dashboard'])
        ->middleware('role:admin')
        ->name('dashboard');

    // Classification form (GET)
    Route::get('/classify', [PredictionController::class, 'showClassifyForm'])
        ->middleware('role:patient')
        ->name('classify');

    // Classification form submission (POST)
    Route::post('/classify', [PredictionController::class, 'classify'])
        ->middleware('role:patient')
        ->name('classify.store');

    // Classification result
    Route::get('/classify/result', [PredictionController::class, 'result'])
        ->name('classify.result');

    // Classification history
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

    Route::get('predictions/{prediction}/print', [PredictionController::class, 'print'])
        ->name('predictions.print');

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
