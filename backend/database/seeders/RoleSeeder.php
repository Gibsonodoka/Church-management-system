<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            ['name' => 'Admin'],
            ['name' => 'Senior Pastor'],
            ['name' => 'Pastor'],
            ['name' => 'Team Lead'],
            ['name' => 'Member'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
