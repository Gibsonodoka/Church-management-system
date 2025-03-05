<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Fetch all users (Only for Super Admin).
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Assign a role to a user (Only for Super Admin).
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|in:Super Admin,Senior Pastor,Pastor,Team Head',
            'team' => 'nullable|string|in:Media,Ushering,Visitation,Music,Finance',
        ]);

        $user->role = $request->role;

        // Assign a team only if the role is 'Team Head'
        if ($request->role === 'Team Head') {
            $user->team = $request->team;
        } else {
            $user->team = null; // Reset team if not a Team Head
        }

        $user->save();

        return response()->json(['message' => 'Role assigned successfully', 'user' => $user]);
    }
}
