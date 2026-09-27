<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SchoolSetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('school_setting_singleton'));
        static::deleted(fn () => Cache::forget('school_setting_singleton'));
    }

    /**
     * Get the active school setting singleton.
     */
    public static function current(): self
    {
        $cached = Cache::get('school_setting_singleton');
        if ($cached instanceof self) {
            return $cached;
        }

        $setting = self::firstOrCreate(
            ['id' => 1],
            [
                'school_name' => 'SMK Negeri Terpadu Tanggapin',
                'npsn' => '20219876',
                'subscription_plan' => 'unggulan',
                'max_classes' => 35,
                'academic_year' => '2025/2026 Ganjil',
            ]
        );
        Cache::put('school_setting_singleton', $setting, 60);

        return $setting;
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
