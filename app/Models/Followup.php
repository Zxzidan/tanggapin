<?php

namespace App\Models;

use Database\Factories\FollowupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Followup extends Model
{
    /** @use HasFactory<FollowupFactory> */
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
     * @return BelongsTo<StudentCase, $this>
     */
    public function studentCase(): BelongsTo
    {
        return $this->belongsTo(StudentCase::class);
    }
}
