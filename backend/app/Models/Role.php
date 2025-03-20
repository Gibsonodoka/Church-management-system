<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name'];

    // Define the many-to-many relationship with User
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}