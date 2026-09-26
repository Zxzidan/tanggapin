<?php

namespace App\Models;

use Database\Factories\ParentCommunicationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParentCommunication extends Model
{
    /** @use HasFactory<ParentCommunicationFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return BelongsTo<Student, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
