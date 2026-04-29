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
            $table->integer('tekanan_darah')->nullable()->change();
            $table->enum('keringat_dingin', ['Ya', 'Tidak'])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->integer('tekanan_darah')->nullable(false)->default(0)->change();
            $table->enum('keringat_dingin', ['Ya', 'Tidak'])->nullable(false)->default('Tidak')->change();
        });
    }
};
