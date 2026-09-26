<?php

namespace App\Models;

use Database\Factories\DapodikIssueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DapodikIssue extends Model
{
    /** @use HasFactory<DapodikIssueFactory> */
    use HasFactory;

    protected $guarded = [];
}
