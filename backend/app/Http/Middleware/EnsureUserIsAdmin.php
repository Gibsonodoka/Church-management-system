<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Get the authenticated user
            $user = $request->user();

            // Log the user and their roles for debugging
            Log::info('User attempting to access admin-only route:', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
            ]);

            // Check if the user has the "Admin" role
            if (!$user->hasRole('Admin')) {
                Log::warning('Unauthorized access attempt:', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
                return response()->json([
                    'message' => 'Unauthorized',
                    'error' => 'You do not have the required role to access this resource.',
                ], 403);
            }

            return $next($request);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error in EnsureUserIsAdmin middleware:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Return a detailed error response in JSON format
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : 'Trace hidden in production',
            ], 500);
        }
    }
}