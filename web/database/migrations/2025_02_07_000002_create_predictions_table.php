<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who made prediction
            
            // Clinical data (inputs)
            $table->integer('usia');
            $table->integer('tekanan_darah');
            $table->enum('riwayat_dm', ['Ya', 'Tidak']);
            $table->enum('hipertensi', ['Ya', 'Tidak']);
            $table->enum('riwayat_pjk', ['Ya', 'Tidak']);
            $table->enum('nyeri_menjalar', ['Ya', 'Tidak']);
            $table->string('durasi_nyeri');
            $table->enum('sesak_napas', ['Ya', 'Tidak']);
            $table->enum('mual', ['Ya', 'Tidak']);
            $table->enum('muntah', ['Ya', 'Tidak']);
            $table->enum('keringat_dingin', ['Ya', 'Tidak']);
            
            // Prediction results
            $table->string('prediction_result'); // Angina Pektoris / Bukan Angina Pektoris
            $table->decimal('probability_angina', 5, 4); // 0.0000 - 1.0000
            $table->enum('risk_level', ['LOW', 'MODERATE', 'HIGH']);
            $table->string('confidence');
            $table->json('features_used')->nullable(); // Store processed features
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
