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
        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->index('risk_level');
            $table->index('status');
        });

        Schema::table('student_cases', function (Blueprint $table) {
            $table->index('stage');
            $table->index('priority');
        });

        Schema::table('risk_alerts', function (Blueprint $table) {
            $table->index('is_action_taken');
            $table->index('risk_level');
        });

        Schema::table('followups', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('discipline_records', function (Blueprint $table) {
            $table->index('action_status');
        });

        Schema::table('school_payments', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('ats_records', function (Blueprint $table) {
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['risk_level']);
            $table->dropIndex(['status']);
        });

        Schema::table('student_cases', function (Blueprint $table) {
            $table->dropIndex(['stage']);
            $table->dropIndex(['priority']);
        });

        Schema::table('risk_alerts', function (Blueprint $table) {
            $table->dropIndex(['is_action_taken']);
            $table->dropIndex(['risk_level']);
        });

        Schema::table('followups', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('discipline_records', function (Blueprint $table) {
            $table->dropIndex(['action_status']);
        });

        Schema::table('school_payments', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('ats_records', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
