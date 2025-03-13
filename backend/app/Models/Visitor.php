<?php

namespace App\Models;
use App\Models\Visitor;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'phone',
        'dob',
        'gender',
        'address',
        'want_to_be_member',
        'would_like_visit'
    ];
}
