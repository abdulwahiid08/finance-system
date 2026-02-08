<?php

namespace App\Features\Account;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AccountServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('app/Features/Account/route.php'));
    }
}
