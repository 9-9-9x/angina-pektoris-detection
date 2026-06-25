<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->string('kode_unik')->unique()->nullable()->after('id');
            $table->string('jam_skrining')->nullable()->after('kode_unik');
            $table->string('tgl_skrining')->nullable()->after('jam_skrining');
            $table->enum('untuk', ['diri_sendiri', 'orang_lain'])->nullable()->after('tgl_skrining');
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });

        Schema::table('patients', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('predictions', function (Blueprint $table) {
            $table->dropColumn(['kode_unik', 'jam_skrining', 'tgl_skrining', 'untuk']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });

        Schema::table('patients', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
