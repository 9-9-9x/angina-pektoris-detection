<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'no_rm',
        'umur',
        'jenis_kelamin',
        'alamat',
        'telepon',
        'user_id',
    ];

    protected $casts = [
        'umur' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function predictions(): HasMany
    {
        return $this->hasMany(Prediction::class);
    }

    /**
     * Generate a unique medical record number
     */
    public static function generateNoRm(): string
    {
        $prefix = 'RM';
        $year = date('Y');
        $lastPatient = self::where('no_rm', 'like', "$prefix$year%")
            ->orderBy('no_rm', 'desc')
            ->first();
        
        if ($lastPatient) {
            $lastNumber = (int) substr($lastPatient->no_rm, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return sprintf("%s%s%04d", $prefix, $year, $newNumber);
    }
}
