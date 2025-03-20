<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (No authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Users can register themselves

// Departments
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

// Attendance
Route::apiResource('attendance', AttendanceController::class);
// Attendance analytics routes
Route::get('/attendances/member-growth', [AttendanceController::class, 'getMemberGrowth']);
Route::get('/attendances/demographics', [AttendanceController::class, 'getDemographics']);

// Visitors
Route::get('/visitors/recent', [VisitorController::class, 'recent']);
Route::get('/visitors', [VisitorController::class, 'index']); // Fetch all visitors
Route::post('/visitors', [VisitorController::class, 'store']); // Add a new visitor
Route::put('/visitors/{id}', [VisitorController::class, 'update']); // Update visitor
Route::delete('/visitors/{id}', [VisitorController::class, 'destroy']); // Delete visitor

// Members
Route::post('/members/import', [MemberController::class, 'importMembers']);
Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);
Route::put('/members/{id}', [MemberController::class, 'update']); // Add this line
Route::delete('/members/{id}', [MemberController::class, 'destroy']); // Add this line

// Protected routes (Require authentication via Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Get authenticated user details
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin-only route
    Route::middleware('role:Admin')->get('/admin-only', function () {
        return response()->json(['message' => 'Welcome, Admin!']);
    });

    // Senior Pastor-only route
    Route::middleware('role:Senior Pastor')->get('/senior-pastor-only', function () {
        return response()->json(['message' => 'Welcome, Senior Pastor!']);
    });

    // Pastor-only route
    Route::middleware('role:Pastor')->get('/pastor-only', function () {
        return response()->json(['message' => 'Welcome, Pastor!']);
    });

    // Team Lead-only route
    Route::middleware('role:Team Lead')->get('/team-lead-only', function () {
        return response()->json(['message' => 'Welcome, Team Lead!']);
    });

    // Member-only route
    Route::middleware('role:Member')->get('/member-only', function () {
        return response()->json(['message' => 'Welcome, Member!']);
    });

    // User Role Management
    Route::prefix('users')->group(function () {
        // Assign a role to a user
        Route::post('/{userId}/assign-role', [UserController::class, 'assignRole']);

        // Remove a role from a user
        Route::post('/{userId}/remove-role', [UserController::class, 'removeRole']);

        // Fetch all users (optional, if needed)
        Route::get('/', [UserController::class, 'index']);

        // Fetch a specific user (optional, if needed)
        Route::get('/{userId}', [UserController::class, 'show']);

        // Update a user (optional, if needed)
        Route::put('/{userId}', [UserController::class, 'update']);

        // Delete a user (optional, if needed)
        Route::delete('/{userId}', [UserController::class, 'destroy']);
    });
});