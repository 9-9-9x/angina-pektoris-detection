<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update patients table - replace tanggal_lahir with umur, make no_rm nullable
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('tanggal_lahir');
        });
        
        Schema::table('patients', function (Blueprint $table) {
            $table->integer('umur')->after('no_rm');
            $table->string('no_rm')->nullable()->change();
        });

        // Update predictions table - change nyeri_menjalar to nyeri_dada
        Schema::table('predictions', function (Blueprint $table) {
            $table->renameColumn('nyeri_menjalar', 'nyeri_dada');
            // Add jenis_kelamin since it's needed for ML API
            $table->enum('jenis_kelamin', ['L', 'P'])->after('usia');
        });
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn('umur');
            $table->date('tanggal_lahir')->after('no_rm');
            $table->string('no_rm')->nullable(false)->change();
        });

        Schema::table('predictions', function (Blueprint $table) {
            $table->renameColumn('nyeri_dada', 'nyeri_menjalar');
            $table->dropColumn('jenis_kelamin');
        });
    }
};
