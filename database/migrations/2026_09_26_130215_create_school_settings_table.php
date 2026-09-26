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
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->string('school_name')->default('SMK Negeri Terpadu Tanggapin');
            $table->string('npsn')->default('20219876');
            $table->string('subscription_plan')->default('unggulan'); // 'perintis', 'unggulan', 'yayasan'
            $table->integer('max_classes')->nullable()->default(35); // 10 for perintis, 35 for unggulan, null for unlimited yayasan
            $table->string('academic_year')->default('2025/2026 Ganjil');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_settings');
    }
};
