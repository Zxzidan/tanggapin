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
        Schema::create('student_cases', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('category');
            $table->string('priority')->default('Sedang');
            $table->string('stage')->default('new');
            $table->string('stage_label')->default('Baru Masuk');
            $table->string('assignee_name')->default('Koordinator BK');
            $table->text('last_activity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_cases');
    }
};
