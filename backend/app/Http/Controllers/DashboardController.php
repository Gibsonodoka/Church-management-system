<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Visitor; // Import the Visitor model

class DashboardController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'members' => Member::count(), 
            'visitors' => Visitor::count(), // Fetch the actual count of visitors
            'inventory' => 30,
            'departments' => 8,
            'finance' => 50000,
            'events' => 5,
            'daughterChurches' => 3,
            'attendance' => 90,
        ]);
    }
}