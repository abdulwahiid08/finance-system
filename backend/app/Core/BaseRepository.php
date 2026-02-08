<?php

namespace App\Core;

use App\Core\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

abstract class BaseRepository implements RepositoryInterface
{
    protected Model $model;
    protected array $with = [];

    public function __construct()
    {
        $this->model = $this->makeModel();
    }

    abstract protected function makeModel(): Model;

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->with($this->with)->get($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*'])
    {
        return $this->model->with($this->with)->paginate($perPage, $columns);
    }

    public function find(string $id, array $columns = ['*']): ?Model
    {
        return $this->model->with($this->with)->find($id, $columns);
    }

    public function findBy(string $field, $value, array $columns = ['*']): ?Model
    {
        return $this->model->with($this->with)->where($field, $value)->first($columns);
    }

    public function findWhere(array $criteria, array $columns = ['*']): Collection
    {
        $query = $this->model->with($this->with);

        foreach ($criteria as $field => $value) {
            if (is_array($value)) {
                [$field, $operator, $search] = $value;
                $query->where($field, $operator, $search);
            } else {
                $query->where($field, $value);
            }
        }

        return $query->get($columns);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): bool
    {
        $model = $this->find($id);

        if (!$model) {
            return false;
        }

        return $model->update($data);
    }

    public function delete(string $id): bool
    {
        $model = $this->find($id);

        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    public function with(array $relations): self
    {
        $this->with = $relations;
        return $this;
    }
}
