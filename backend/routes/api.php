<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\DashboardController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
Route::post('/members/import', [MemberController::class, 'importMembers']);
Route::middleware('auth:sanctum')->get('/dashboard-stats', [DashboardController::class, 'getStats']);
Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);
// Public routes (No authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Users can register themselves

// Protected routes (Require authentication via Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Get authenticated user details
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // User management (Only authorized roles can access)
    Route::middleware('role:Super Admin,Senior Pastor,Pastor,Team Head,Admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    // Assign roles (Only Super Admin can assign roles)
    Route::middleware('role:Super Admin')->group(function () {
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
    });
});
