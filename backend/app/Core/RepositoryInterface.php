<?php

namespace App\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface RepositoryInterface
{

    public function all(array $columns = ['*']): Collection;
    public function paginate(int $perPage = 15, array $columns = ['*']);
    public function find(string $id, array $columns = ['*']): ?Model;
    public function findBy(string $field, $value, array $columns = ['*']): ?Model;
    public function findWhere(array $criteria, array $columns = ['*']): Collection;
    public function create(array $data): Model;
    public function update(string $id, array $data): bool;
    public function delete(string $id): bool;
    public function with(array $relations): self;
}
