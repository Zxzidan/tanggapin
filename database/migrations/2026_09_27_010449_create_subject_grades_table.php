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
        Schema::create('subject_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('academic_period')->default('2025/2026 Ganjil');
            $table->string('subject_code')->default('PPLG-401');
            $table->string('subject_name')->default('Pemrograman Web & Perangkat Bergerak');
            $table->string('teacher_name')->default('Siti Aminah, M.Pd');
            $table->integer('kkm')->default(75);
            $table->integer('formative_score')->default(80);
            $table->integer('summative_score')->default(80);
            $table->integer('final_score')->default(80);
            $table->string('predicate')->default('B (Baik)');
            $table->integer('tp1_score')->default(80);
            $table->integer('tp2_score')->default(80);
            $table->integer('tp3_score')->default(80);
            $table->string('tp1_status')->default('Tercapai');
            $table->string('tp2_status')->default('Tercapai');
            $table->string('tp3_status')->default('Tercapai');
            $table->text('attitude_critical')->nullable();
            $table->text('attitude_independence')->nullable();
            $table->text('attitude_cooperation')->nullable();
            $table->text('teacher_notes')->nullable();
            $table->json('ai_analysis')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'subject_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subject_grades');
    }
};
