<?php

namespace App\Models;

use Database\Factories\StudentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    /** @use HasFactory<StudentFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<SchoolClass, $this>
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class);
    }

    /**
     * @return HasMany<RiskAlert, $this>
     */
    public function riskAlerts(): HasMany
    {
        return $this->hasMany(RiskAlert::class);
    }

    /**
     * @return HasMany<StudentCase, $this>
     */
    public function studentCases(): HasMany
    {
        return $this->hasMany(StudentCase::class);
    }

    /**
     * @return HasMany<Followup, $this>
     */
    public function followups(): HasMany
    {
        return $this->hasMany(Followup::class);
    }

    /**
     * @return HasMany<ParentCommunication, $this>
     */
    public function parentCommunications(): HasMany
    {
        return $this->hasMany(ParentCommunication::class);
    }

    /**
     * @return HasMany<DisciplineRecord, $this>
     */
    public function disciplineRecords(): HasMany
    {
        return $this->hasMany(DisciplineRecord::class);
    }

    /**
     * @return HasOne<AtsRecord, $this>
     */
    public function atsRecord(): HasOne
    {
        return $this->hasOne(AtsRecord::class);
    }

    /**
     * @return HasMany<SchoolPayment, $this>
     */
    public function schoolPayments(): HasMany
    {
        return $this->hasMany(SchoolPayment::class);
    }

    /**
     * @return HasMany<StudentReport, $this>
     */
    public function reports(): HasMany
    {
        return $this->hasMany(StudentReport::class);
    }

    /**
     * @return HasMany<SubjectGrade, $this>
     */
    public function subjectGrades(): HasMany
    {
        return $this->hasMany(SubjectGrade::class);
    }

    /**
     * @return HasMany<HomeroomJournal, $this>
     */
    public function homeroomJournals(): HasMany
    {
        return $this->hasMany(HomeroomJournal::class);
    }
}
