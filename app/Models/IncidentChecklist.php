<?php

namespace App\Models;

use Database\Factories\IncidentChecklistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncidentChecklist extends Model
{
    /** @use HasFactory<IncidentChecklistFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_done' => 'boolean',
    ];

    /**
     * @return BelongsTo<Incident, $this>
     */
    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
