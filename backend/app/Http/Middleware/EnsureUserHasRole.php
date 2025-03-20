<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role  The required role to access the resource
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Check if the user is authenticated and has the required role (case-insensitive)
        if (Auth::check() && Auth::user()->hasRole($role)) {
            return $next($request);
        }

        // If not, return a 403 Forbidden response
        return response()->json([
            'message' => 'Unauthorized',
            'error' => 'You do not have the required role to access this resource.'
        ], 403);
    }
}