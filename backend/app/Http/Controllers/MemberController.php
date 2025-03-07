<?php

namespace App\Http\Controllers; // Add this line

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MemberController extends Controller
{
    public function index()
    {
        return response()->json(Member::all());
    }
}
