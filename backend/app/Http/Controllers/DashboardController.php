<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;

class DashboardController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'members' =>  Member::count(),
            'visitors' => 45,
            'inventory' => 30,
            'departments' => 8,
            'finance' => 50000,
            'events' => 5,
            'daughterChurches' => 3,
            'attendance' => 90,
        ]);
    }
}
