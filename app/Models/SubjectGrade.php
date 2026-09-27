<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubjectGrade extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'ai_analysis' => 'array',
        'kkm' => 'integer',
        'formative_score' => 'integer',
        'summative_score' => 'integer',
        'final_score' => 'integer',
        'tp1_score' => 'integer',
        'tp2_score' => 'integer',
        'tp3_score' => 'integer',
    ];

    /**
     * @return BelongsTo<Student, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
