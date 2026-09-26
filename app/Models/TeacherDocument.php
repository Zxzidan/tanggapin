<?php

namespace App\Models;

use Database\Factories\TeacherDocumentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherDocument extends Model
{
    /** @use HasFactory<TeacherDocumentFactory> */
    use HasFactory;

    protected $guarded = [];
}
