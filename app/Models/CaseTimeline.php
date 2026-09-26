<?php

namespace App\Models;

use Database\Factories\CaseTimelineFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseTimeline extends Model
{
    /** @use HasFactory<CaseTimelineFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<StudentCase, $this>
     */
    public function studentCase(): BelongsTo
    {
        return $this->belongsTo(StudentCase::class);
    }
}
