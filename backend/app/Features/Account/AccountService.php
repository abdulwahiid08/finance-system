<?php

namespace App\Features\Account;

use App\Features\Account\Account;
use App\Features\Account\AccountRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class AccountService
{
    public function __construct(
        protected AccountRepository $accountRepository
    ) {}

    /**
     * Get all accounts
     */
    public function getAllAccounts()
    {
        return $this->accountRepository->all();
    }

    /**
     * Get account hierarchy tree
     */
    public function getAccountTree(?string $type = null)
    {
        return $this->accountRepository->getHierarchyTree($type);
    }

    /**
     * Get active accounts for dropdown
     */
    public function getActiveAccounts()
    {
        return $this->accountRepository->getActive();
    }

    /**
     * Get account by ID
     */
    public function getAccountById(string $id)
    {
        return $this->accountRepository->getWithPath($id);
    }

    /**
     * Create new account
     */
    public function createAccount(array $data): Account
    {
        DB::beginTransaction();

        try {
            // Generate account code
            $code = $this->accountRepository->getNextCode(
                $data['type'],
                $data['parent_id'] ?? null
            );

            // Calculate level
            $level = 0;
            if (isset($data['parent_id'])) {
                $parent = $this->accountRepository->find($data['parent_id']);
                $level = $parent->level + 1;
            }

            $account = $this->accountRepository->create([
                'code' => $code,
                'name' => $data['name'],
                'type' => $data['type'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'parent_id' => $data['parent_id'] ?? null,
                'level' => $level,
                'balance' => 0,
            ]);

            DB::commit();

            return $account;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update account
     */
    public function updateAccount(string $id, array $data): bool
    {
        DB::beginTransaction();

        try {
            $account = $this->accountRepository->find($id);

            if (!$account) {
                throw new Exception('Account not found');
            }

            // Check if parent is being changed
            if (isset($data['parent_id']) && $data['parent_id'] != $account->parent_id) {
                // Prevent circular reference
                if ($this->wouldCreateCircularReference($id, $data['parent_id'])) {
                    throw new Exception('Cannot set parent: would create circular reference');
                }

                // Regenerate code if parent changed
                $data['code'] = $this->accountRepository->getNextCode(
                    $data['type'] ?? $account->type,
                    $data['parent_id']
                );

                // Recalculate level
                if ($data['parent_id']) {
                    $parent = $this->accountRepository->find($data['parent_id']);
                    $data['level'] = $parent->level + 1;
                } else {
                    $data['level'] = 0;
                }
            }

            $result = $this->accountRepository->update($id, $data);

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete account
     */
    public function deleteAccount(string $id): bool
    {
        DB::beginTransaction();

        try {
            $account = $this->accountRepository->find($id);

            if (!$account) {
                throw new Exception('Account not found');
            }

            // Check if account has children
            if ($account->hasChildren()) {
                throw new Exception('Cannot delete account with children');
            }

            // Check if account has transactions
            if ($account->transactionDetails()->exists()) {
                throw new Exception('Cannot delete account with existing transactions');
            }

            $result = $this->accountRepository->delete($id);

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Toggle account status
     */
    public function toggleStatus(string $id): bool
    {
        $account = $this->accountRepository->find($id);

        if (!$account) {
            throw new Exception('Account not found');
        }

        return $this->accountRepository->update($id, [
            'is_active' => !$account->is_active
        ]);
    }

    /**
     * Search accounts
     */
    public function searchAccounts(string $keyword)
    {
        return $this->accountRepository->search($keyword);
    }

    /**
     * Get accounts by type
     */
    public function getAccountsByType(string $type)
    {
        return $this->accountRepository->getByType($type);
    }

    /**
     * Get account balance summary
     */
    public function getBalanceSummary()
    {
        $accounts = $this->accountRepository->all();

        $summary = [
            'asset' => 0,
            'liability' => 0,
            'equity' => 0,
            'revenue' => 0,
            'expense' => 0,
        ];

        foreach ($accounts as $account) {
            $summary[$account->type] += $account->balance;
        }

        return $summary;
    }

    /**
     * Check if changing parent would create circular reference
     */
    protected function wouldCreateCircularReference(string $accountId, ?string $newParentId): bool
    {
        if (!$newParentId) {
            return false;
        }

        $parent = $this->accountRepository->find($newParentId);

        while ($parent) {
            if ($parent->id === $accountId) {
                return true;
            }
            $parent = $parent->parent;
        }

        return false;
    }
}
