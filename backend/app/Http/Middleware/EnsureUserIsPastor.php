<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsPastor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated and has the "Pastor" role
        if (Auth::check() && Auth::user()->hasRole('Pastor')) {
            return $next($request);
        }

        // If not, return a 403 Forbidden response
        return response()->json([
            'message' => 'Unauthorized',
            'error' => 'You do not have the required role to access this resource.'
        ], 403);
    }
}