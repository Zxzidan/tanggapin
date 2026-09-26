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
        Schema::create('dapodik_issues', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('target_name');
            $table->string('field');
            $table->text('description');
            $table->string('severity')->default('Perlu Diperiksa');
            $table->string('action');
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dapodik_issues');
    }
};
