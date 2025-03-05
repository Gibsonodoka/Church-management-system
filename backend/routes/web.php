<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;

// Public route (Homepage)
Route::get('/', function () {
    return view('welcome');
});

// Authentication routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protect routes with authentication and roles
Route::middleware(['auth'])->group(function () {

    // Super Admin & Senior Pastor have the same dashboard
    Route::middleware(['role:Super Admin,Senior Pastor'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.pastor.dashboard');
    });

    // Pastors Access
    Route::middleware(['role:Pastor'])->group(function () {
        Route::get('/pastors', function () {
            return "Pastors Dashboard";
        })->name('pastors.dashboard');
    });

    // Team Heads Access (Media, Ushering, Visitation, Music, Finance)
    Route::middleware(['role:Team Head'])->group(function () {
        Route::get('/team', function () {
            return "Team Dashboard";
        })->name('team.dashboard');
    });
});
