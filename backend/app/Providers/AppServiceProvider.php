<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\EnsureUserHasRole;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Log that the service provider is registering
        Log::info('AppServiceProvider: Registering application services.');

        // Bind the role middleware to the service container
        $this->app->bind('role', function ($app) {
            return new EnsureUserHasRole();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Log that the service provider is bootstrapping
        Log::info('AppServiceProvider: Bootstrapping application services.');
    }
}