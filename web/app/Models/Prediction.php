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
        'jenis_kelamin',
        'tekanan_darah',
        'riwayat_dm',
        'hipertensi',
        'riwayat_pjk',
        'nyeri_dada',
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
        'doctor_verdict',
        'doctor_notes',
        'verdict_by',
        'verdict_at',
    ];

    protected $appends = [
        'risk_percentage',
        'risk_color',
        'risk_text',
        'hasil_klasifikasi',
    ];

    protected $casts = [
        'probability_angina' => 'float',
        'features_used' => 'array',
        'verdict_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verdictBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verdict_by');
    }

    public function getRiskColorAttribute(): string
    {
        return match ($this->risk_level) {
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

    public function getRiskTextAttribute(): string
    {
        return match ($this->risk_level) {
            'HIGH' => 'Tinggi',
            'MODERATE' => 'Sedang',
            'LOW' => 'Rendah',
            default => $this->risk_level,
        };
    }

    public function getHasilKlasifikasiAttribute(): string
    {
        return $this->prediction_result === 'Angina Pektoris'
            ? 'Angina Pektoris'
            : 'Bukan Angina';
    }
}
