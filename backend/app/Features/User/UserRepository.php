<?php

namespace App\Features\User;

use App\Core\BaseRepository;
use App\Features\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository
{
    protected function makeModel(): Model
    {
        return new User();
    }

    public function findByEmail(string $email): ?User
    {
        return $this->findBy('email', $email);
    }

    public function createUser(array $data): User
    {
        return $this->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
