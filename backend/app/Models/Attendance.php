<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'month',
        'service_description',
        'men',
        'women',
        'youth',
        'teens',
        'children',
        'total'
    ];
}
