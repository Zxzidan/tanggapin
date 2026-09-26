<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * Get the active school setting singleton.
     */
    public static function current(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'school_name' => 'SMK Negeri Terpadu Tanggapin',
                'npsn' => '20219876',
                'subscription_plan' => 'unggulan',
                'max_classes' => 35,
                'academic_year' => '2025/2026 Ganjil',
            ]
        );
    }

    /**
     * Check if the school class limit has been reached.
     */
    public function isClassLimitReached(): bool
    {
        if ($this->subscription_plan === 'yayasan' || $this->max_classes === null) {
            return false;
        }

        return SchoolClass::count() >= $this->max_classes;
    }

    /**
     * Get class limit number or null for unlimited.
     */
    public function getClassLimit(): ?int
    {
        if ($this->subscription_plan === 'yayasan') {
            return null;
        }

        return $this->max_classes ?? 35;
    }
}
