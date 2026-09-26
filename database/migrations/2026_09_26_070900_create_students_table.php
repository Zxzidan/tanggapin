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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->string('nisn')->unique();
            $table->string('name');
            $table->string('gender')->default('L');
            $table->string('parent_name');
            $table->string('parent_phone');
            $table->text('address')->nullable();
            $table->unsignedTinyInteger('attendance_rate')->default(100);
            $table->string('risk_level')->default('low');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
