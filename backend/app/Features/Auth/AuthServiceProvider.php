<?php

namespace App\Features\Auth;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadRoutes();
    }

    protected function loadRoutes(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('app/Features/Auth/route.php'));
    }
}
