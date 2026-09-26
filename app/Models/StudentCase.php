<?php

namespace App\Models;

use Database\Factories\StudentCaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentCase extends Model
{
    /** @use HasFactory<StudentCaseFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<Student, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * @return HasMany<CaseTimeline, $this>
     */
    public function timelines(): HasMany
    {
        return $this->hasMany(CaseTimeline::class);
    }

    /**
     * @return HasMany<Followup, $this>
     */
    public function followups(): HasMany
    {
        return $this->hasMany(Followup::class);
    }
}
