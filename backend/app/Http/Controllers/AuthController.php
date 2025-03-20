<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Handle user registration (API-based).
     */
    public function register(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role_id' => 'required|exists:roles,id',
            ]);

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Assign the role to the user
            $role = Role::findOrFail($request->role_id);
            $user->roles()->attach($role->id);

            // Load the roles relationship
            $user->load('roles');

            // Generate API Token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Return success response
            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'roles' => $user->roles, // Include roles in the response
                ],
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Registration Error: ' . $e->getMessage());

            // Return a generic error message
            return response()->json([
                'message' => 'An error occurred during registration.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle user login (API-based).
     */
    public function login(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:6',
            ]);

            // Attempt to authenticate the user
            if (Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();

                // Load the roles relationship
                $user->load('roles');

                // Generate API Token
                $token = $user->createToken('auth_token')->plainTextToken;

                // Return success response
                return response()->json([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                        'roles' => $user->roles, // Include roles in the response
                    ],
                    'token' => $token,
                ], 200);
            }

            // Return error if authentication fails
            return response()->json(['message' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Login Error: ' . $e->getMessage());

            // Return a generic error message
            return response()->json([
                'message' => 'An error occurred during login.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle user logout (API-based).
     */
    public function logout(Request $request)
    {
        try {
            // Revoke all tokens for the user
            $request->user()->tokens()->delete();

            // Return success response
            return response()->json([
                'message' => 'Logged out successfully'
            ], 200);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Logout Error: ' . $e->getMessage());

            // Return a generic error message
            return response()->json([
                'message' => 'An error occurred during logout.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the login form (for web-based login).
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }
}