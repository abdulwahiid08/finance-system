<?php

use Illuminate\Support\Facades\Route;
use App\Features\Account\AccountController;

Route::middleware('auth:api')->prefix('accounts')->group(function () {
    Route::get('/', [AccountController::class, 'index']);
    Route::get('/tree', [AccountController::class, 'tree']);
    Route::get('/active', [AccountController::class, 'active']);
    Route::get('/search', [AccountController::class, 'search']);
    Route::get('/summary', [AccountController::class, 'summary']);
    Route::post('/', [AccountController::class, 'store']);
    Route::get('/{id}', [AccountController::class, 'show']);
    Route::put('/{id}', [AccountController::class, 'update']);
    Route::delete('/{id}', [AccountController::class, 'destroy']);
    Route::post('/{id}/toggle', [AccountController::class, 'toggleStatus']);
});
