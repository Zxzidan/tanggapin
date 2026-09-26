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
        Schema::table('student_cases', function (Blueprint $table) {
            $table->string('referred_by_name')->nullable()->after('assignee_name');
            $table->text('referral_notes')->nullable()->after('referred_by_name');
            $table->string('handled_by_bk_name')->nullable()->after('referral_notes');
            $table->string('bk_action_type')->nullable()->after('handled_by_bk_name');
            $table->text('bk_handling_notes')->nullable()->after('bk_action_type');
            $table->timestamp('handled_at')->nullable()->after('bk_handling_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_cases', function (Blueprint $table) {
            $table->dropColumn([
                'referred_by_name',
                'referral_notes',
                'handled_by_bk_name',
                'bk_action_type',
                'bk_handling_notes',
                'handled_at',
            ]);
        });
    }
};
