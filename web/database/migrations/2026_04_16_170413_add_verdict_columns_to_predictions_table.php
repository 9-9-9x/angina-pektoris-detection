<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->enum('doctor_verdict', ['Angina Pektoris', 'Bukan Angina Pektoris', 'Perlu Pemeriksaan Lanjut'])->nullable()->after('features_used');
            $table->text('doctor_notes')->nullable()->after('doctor_verdict');
            $table->foreignId('verdict_by')->nullable()->constrained('users')->nullOnDelete()->after('doctor_notes');
            $table->timestamp('verdict_at')->nullable()->after('verdict_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->dropForeign(['verdict_by']);
            $table->dropColumn(['doctor_verdict', 'doctor_notes', 'verdict_by', 'verdict_at']);
        });
    }
};
