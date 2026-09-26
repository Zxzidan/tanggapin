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
        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('report_code')->unique();
            $table->string('academic_period')->default('2025/2026 Ganjil');
            $table->integer('attendance_rate')->default(100);
            $table->integer('sick_count')->default(0);
            $table->integer('permission_count')->default(0);
            $table->integer('unexcused_count')->default(0);
            $table->integer('discipline_points')->default(0);
            $table->string('discipline_status')->default('Tertib & Terbina');
            $table->text('ai_character_summary');
            $table->text('ai_academic_notes')->nullable();
            $table->text('parent_recommendations');
            $table->string('status')->default('generated'); // draft, generated, sent
            $table->string('sent_to_parent_at')->nullable();
            $table->string('parent_phone')->nullable();
            $table->string('parent_name')->nullable();
            $table->string('delivery_channel')->default('WhatsApp Official & Tanggapin App');
            $table->string('acknowledgement_status')->default('Menunggu Respon');
            $table->string('homeroom_teacher_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_reports');
    }
};
