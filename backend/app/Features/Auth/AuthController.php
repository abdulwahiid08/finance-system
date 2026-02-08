<?php

namespace App\Features\Auth;

use App\Core\BaseController;
use App\Features\Auth\LoginRequest;
use App\Features\Auth\RegisterRequest;
use App\Features\Auth\AuthService;
use App\Features\User\UserResource;
use Illuminate\Http\JsonResponse;

class AuthController extends BaseController
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return $this->createdResponse([
                'user' => new UserResource($result['user']),
                // 'access_token' => $result['token'],
                // 'token_type' => $result['token_type'],
                // 'expires_in' => $result['expires_in'],
            ], 'Registration successful');
        } catch (\Exception $e) {
            return $this->errorResponse('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return $this->unauthorizedResponse('Invalid credentials');
        }

        return $this->successResponse([
            'user' => new UserResource($result['user']),
            'access_token' => $result['token'],
            'token_type' => $result['token_type'],
            'expires_in' => $result['expires_in'],
        ], 'Login successful');
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();
        return $this->successResponse(null, 'Successfully logged out');
    }

    public function refresh(): JsonResponse
    {
        $result = $this->authService->refresh();

        return $this->successResponse([
            'access_token' => $result['token'],
            'token_type' => $result['token_type'],
            'expires_in' => $result['expires_in'],
        ], 'Token refreshed successfully');
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->me();
        return $this->successResponse(new UserResource($user));
    }
}
