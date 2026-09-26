<?php

namespace App\Models;

use Database\Factories\RiskAlertFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskAlert extends Model
{
    /** @use HasFactory<RiskAlertFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_action_taken' => 'boolean',
    ];

    /**
     * @return BelongsTo<Student, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
