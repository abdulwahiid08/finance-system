<?php

namespace App\Features\Transaction;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class TransactionServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('app/Features/Transaction/route.php'));
    }
}
