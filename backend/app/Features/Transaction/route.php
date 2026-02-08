<?php

use Illuminate\Support\Facades\Route;
use App\Features\Transaction\TransactionController;

Route::middleware('auth:api')->prefix('transactions')->group(function () {
    Route::get('/', [TransactionController::class, 'index']);
    Route::get('/filter', [TransactionController::class, 'filter']);
    Route::get('/{id}', [TransactionController::class, 'show']);
    Route::get('/ledger/{accountId}', [TransactionController::class, 'ledger']);
    Route::post('/', [TransactionController::class, 'store']);
    Route::put('/{id}', [TransactionController::class, 'update']);
    Route::delete('/{id}', [TransactionController::class, 'destroy']);
});
