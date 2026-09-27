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
        Schema::create('homeroom_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained('school_classes')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('homeroom_teacher_name')->default('Wali Kelas');
            $table->date('journal_date');
            $table->string('category')->default('Akademik & Nilai Mapel');
            $table->string('title');
            $table->text('issue_description');
            $table->text('counseling_approach');
            $table->text('student_commitment');
            $table->string('status')->default('Sedang Dipantau');
            $table->string('parent_notified_at')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'journal_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homeroom_journals');
    }
};
