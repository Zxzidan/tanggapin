<?php

namespace App\Models;

use Database\Factories\SchoolPaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolPayment extends Model
{
    /** @use HasFactory<SchoolPaymentFactory> */
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
