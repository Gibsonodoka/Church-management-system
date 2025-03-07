<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'gender',
        'dob',
        'address',
        'marital_status',
        'baptized',
        'membership_class',
        'house_fellowship',
        'organization_belonged_to',
        'current_team',
    ];
    
}
