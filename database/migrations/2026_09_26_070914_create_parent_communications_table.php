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
        Schema::create('parent_communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('sender_name')->default('Wali Kelas');
            $table->string('parent_name');
            $table->string('category');
            $table->text('message');
            $table->string('status')->default('Terkirim via WhatsApp & App');
            $table->string('acknowledgement')->default('Menunggu Respon');
            $table->string('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_communications');
    }
};
