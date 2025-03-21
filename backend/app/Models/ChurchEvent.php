<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChurchEvent extends Model
{
    use HasFactory;

    // Define the fillable fields
    protected $fillable = [
        'title',
        'description',
        'start',
        'end',
        'location',
        'organizer',
        'type',
    ];
}