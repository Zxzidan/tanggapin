<?php

namespace App\Models;

use Database\Factories\IncidentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Incident extends Model
{
    /** @use HasFactory<IncidentFactory> */
    use HasFactory;

    protected $guarded = [];

    /**
     * @return HasMany<IncidentChecklist, $this>
     */
    public function checklists(): HasMany
    {
        return $this->hasMany(IncidentChecklist::class);
    }
}
