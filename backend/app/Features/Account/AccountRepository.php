<?php

namespace App\Features\Account;

use App\Core\BaseRepository;
use App\Features\Account\Account;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class AccountRepository extends BaseRepository
{
    protected function makeModel(): Model
    {
        return new Account();
    }

    /**
     * Get next account code by type
     */
    public function getNextCode(string $type, ?string $parentId = null): string
    {
        $prefix = Account::CODE_PREFIXES[$type];

        if ($parentId) {
            $parent = $this->find($parentId);
            $lastChild = Account::where('parent_id', $parentId)
                ->orderBy('code', 'desc')
                ->first();

            if ($lastChild) {
                $lastNumber = intval(substr($lastChild->code, -2));
                $nextNumber = str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = '01';
            }

            return $parent->code . $nextNumber;
        }

        // Get last parent account of this type
        $lastAccount = Account::where('type', $type)
            ->whereNull('parent_id')
            ->orderBy('code', 'desc')
            ->first();

        if ($lastAccount) {
            $lastNumber = intval(substr($lastAccount->code, 1, 2));
            $nextNumber = str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '01';
        }

        return $prefix . $nextNumber . '00';
    }

    /**
     * Get accounts by type
     */
    public function getByType(string $type): Collection
    {
        return $this->model->where('type', $type)->get();
    }

    /**
     * Get active accounts
     */
    public function getActive(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Get parent accounts only
     */
    public function getParents(): Collection
    {
        return $this->model->whereNull('parent_id')->get();
    }

    /**
     * Get children of specific account
     */
    public function getChildren(string $parentId): Collection
    {
        return $this->model->where('parent_id', $parentId)->get();
    }

    /**
     * Get account hierarchy tree
     */
    public function getHierarchyTree(?string $type = null): Collection
    {
        $query = $this->model->with('children.children')
            ->whereNull('parent_id');

        if ($type) {
            $query->where('type', $type);
        }

        return $query->orderBy('code')->get();
    }

    /**
     * Update account balance
     */
    public function updateBalance(string $accountId, float $amount): bool
    {
        $account = $this->find($accountId);

        if (!$account) {
            return false;
        }

        $account->balance += $amount;
        return $account->save();
    }

    /**
     * Search accounts
     */
    public function search(string $keyword): Collection
    {
        return $this->model
            ->where('name', 'like', "%{$keyword}%")
            ->orWhere('code', 'like', "%{$keyword}%")
            ->get();
    }

    /**
     * Check if account code exists
     */
    public function codeExists(string $code, ?string $excludeId = null): bool
    {
        $query = $this->model->where('code', $code);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get account with full hierarchy path
     */
    public function getWithPath(string $id): ?Account
    {
        return $this->model->with('parent.parent.parent')->find($id);
    }
}
