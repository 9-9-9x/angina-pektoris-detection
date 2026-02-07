<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'user_id',
        'usia',
        'tekanan_darah',
        'riwayat_dm',
        'hipertensi',
        'riwayat_pjk',
        'nyeri_menjalar',
        'durasi_nyeri',
        'sesak_napas',
        'mual',
        'muntah',
        'keringat_dingin',
        'prediction_result',
        'probability_angina',
        'risk_level',
        'confidence',
        'features_used',
    ];

    protected $casts = [
        'probability_angina' => 'float',
        'features_used' => 'array',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRiskColorAttribute(): string
    {
        return match($this->risk_level) {
            'HIGH' => 'red',
            'MODERATE' => 'yellow',
            'LOW' => 'green',
            default => 'gray',
        };
    }

    public function getRiskPercentageAttribute(): float
    {
        return round($this->probability_angina * 100, 2);
    }
}
