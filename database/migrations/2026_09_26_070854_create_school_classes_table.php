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
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('major');
            $table->string('academic_year')->default('2025/2026 Ganjil');
            $table->string('homeroom_teacher_name');
            $table->unsignedSmallInteger('total_students')->default(0);
            $table->unsignedTinyInteger('attendance_rate')->default(100);
            $table->string('health_status')->default('good');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classes');
    }
};
