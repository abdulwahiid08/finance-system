<?php

use App\Features\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// API ROUTES -> di akses langsung melalui provider
// Route::prefix('auth')->group(function () {
//     // AUTH ROUTES
//     Route::post('register', [AuthController::class, 'register']);
//     Route::post('login', [AuthController::class, 'login']);

//     Route::middleware('auth:sacntum')->group(function () {
//         Route::post('logout', [AuthController::class, 'logout']);
//         Route::post('refresh', [AuthController::class, 'refresh']);
//         Route::get('me', [AuthController::class, 'me']);
//     });
// });

// Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
//     // ALL ROUTES
// });
