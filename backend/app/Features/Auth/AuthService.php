<?php

namespace App\Features\Auth;

use App\Features\User\User;
use App\Features\User\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function register(array $data): array
    {
        DB::beginTransaction();

        try {
            $user = $this->userRepository->createUser($data);
            $token = JWTAuth::fromUser($user);

            DB::commit();

            return [
                'user' => $user,
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function login(array $credentials): ?array
    {
        if (!$token = auth()->attempt($credentials)) {
            return null;
        }

        return [
            'user' => auth()->user(),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function logout(): void
    {
        auth()->logout();
    }

    public function refresh(): array
    {
        $token = auth()->refresh();

        return [
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }

    public function me(): User
    {
        return auth()->user();
    }
}
