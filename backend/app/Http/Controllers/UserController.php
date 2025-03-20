<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::with('roles')->get(); // Fetch all users with their roles
        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'sometimes|integer|exists:roles,id', // Optional role assignment
        ]);

        // Hash the password before saving
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Create the user
        $user = User::create($validatedData);

        // Assign a role if provided
        if (isset($validatedData['role_id'])) {
            $user->roles()->attach($validatedData['role_id']);
        }

        return response()->json($user, 201);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id); // Fetch the user with roles
        return response()->json($user);
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($user->id), // Ensure email is unique except for the current user
            ],
            'password' => 'sometimes|string|min:8',
            'role_id' => 'sometimes|integer|exists:roles,id', // Optional role assignment
        ]);

        // Hash the password if provided
        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        // Update the user
        $user->update($validatedData);

        // Assign a role if provided
        if (isset($validatedData['role_id'])) {
            $user->roles()->sync([$validatedData['role_id']]); // Replace existing roles
        }

        return response()->json($user);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Assign a role to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function assignRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();

        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]); // Assign the role without detaching existing roles
            return response()->json(['message' => 'Role assigned successfully']);
        }

        return response()->json(['message' => 'Role not found'], 404);
    }

    /**
     * Remove a role from a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function removeRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();

        if ($role) {
            $user->roles()->detach($role->id); // Remove the role
            return response()->json(['message' => 'Role removed successfully']);
        }

        return response()->json(['message' => 'Role not found'], 404);
    }
}