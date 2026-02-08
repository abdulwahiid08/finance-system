<?php

namespace App\Features\Transaction;

use App\Features\Transaction\Transaction;
use App\Features\Transaction\TransactionDetail;
use App\Features\Transaction\TransactionRepository;
use App\Features\Account\AccountRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionService
{
    public function __construct(
        protected TransactionRepository $transactionRepository,
        protected AccountRepository $accountRepository
    ) {}

    /**
     * Get all transactions
     */
    public function getAllTransactions()
    {
        return $this->transactionRepository->getAllWithDetails();
    }

    /**
     * Get transaction by ID
     */
    public function getTransactionById(string $id)
    {
        return $this->transactionRepository->getWithFullDetails($id);
    }

    /**
     * Filter transactions
     */
    public function filterTransactions(array $filters)
    {
        return $this->transactionRepository->filter($filters);
    }

    /**
     * Create transaction with double entry
     */
    public function createTransaction(array $data): Transaction
    {
        DB::beginTransaction();

        try {
            // Validate double entry (debit = credit)
            $totalDebit = 0;
            $totalCredit = 0;

            foreach ($data['entries'] as $entry) {
                if ($entry['type'] === 'debit') {
                    $totalDebit += $entry['amount'];
                } else {
                    $totalCredit += $entry['amount'];
                }
            }

            if (abs($totalDebit - $totalCredit) > 0.01) {
                throw new Exception('Transaction not balanced. Total debit must equal total credit.');
            }

            // Generate transaction number
            $transactionNumber = $this->transactionRepository->generateTransactionNumber();

            // Create transaction
            $transaction = $this->transactionRepository->create([
                'transaction_number' => $transactionNumber,
                'transaction_date' => $data['transaction_date'],
                'description' => $data['description'],
                'total_amount' => $totalDebit, // or $totalCredit, they're equal
                'created_by' => auth()->id(),
            ]);

            // Create transaction details and update account balances
            foreach ($data['entries'] as $entry) {
                // Create detail
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'account_id' => $entry['account_id'],
                    'type' => $entry['type'],
                    'amount' => $entry['amount'],
                    'notes' => $entry['notes'] ?? null,
                ]);

                // Update account balance
                $this->updateAccountBalance(
                    $entry['account_id'],
                    $entry['type'],
                    $entry['amount']
                );
            }

            DB::commit();

            return $transaction->load(['details.account', 'creator']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update transaction
     */
    public function updateTransaction(string $id, array $data): Transaction
    {
        DB::beginTransaction();

        try {
            $transaction = $this->transactionRepository->find($id);

            if (!$transaction) {
                throw new Exception('Transaction not found');
            }

            // Validate double entry
            $totalDebit = 0;
            $totalCredit = 0;

            foreach ($data['entries'] as $entry) {
                if ($entry['type'] === 'debit') {
                    $totalDebit += $entry['amount'];
                } else {
                    $totalCredit += $entry['amount'];
                }
            }

            if (abs($totalDebit - $totalCredit) > 0.01) {
                throw new Exception('Transaction not balanced. Total debit must equal total credit.');
            }

            // Reverse old balances
            foreach ($transaction->details as $detail) {
                $this->reverseAccountBalance(
                    $detail->account_id,
                    $detail->type,
                    $detail->amount
                );
            }

            // Delete old details
            $transaction->details()->delete();

            // Update transaction
            $this->transactionRepository->update($id, [
                'transaction_date' => $data['transaction_date'],
                'description' => $data['description'],
                'total_amount' => $totalDebit,
            ]);

            // Create new details and update balances
            foreach ($data['entries'] as $entry) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'account_id' => $entry['account_id'],
                    'type' => $entry['type'],
                    'amount' => $entry['amount'],
                    'notes' => $entry['notes'] ?? null,
                ]);

                $this->updateAccountBalance(
                    $entry['account_id'],
                    $entry['type'],
                    $entry['amount']
                );
            }

            DB::commit();

            return $transaction->fresh(['details.account', 'creator']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete transaction
     */
    public function deleteTransaction(string $id): bool
    {
        DB::beginTransaction();

        try {
            $transaction = $this->transactionRepository->find($id);

            if (!$transaction) {
                throw new Exception('Transaction not found');
            }

            // Reverse account balances
            foreach ($transaction->details as $detail) {
                $this->reverseAccountBalance(
                    $detail->account_id,
                    $detail->type,
                    $detail->amount
                );
            }

            // Delete transaction (details will be cascade deleted)
            $result = $this->transactionRepository->delete($id);

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get transactions by account
     */
    public function getTransactionsByAccount(string $accountId, ?string $startDate = null, ?string $endDate = null)
    {
        return $this->transactionRepository->getByAccount($accountId, $startDate, $endDate);
    }

    /**
     * Get transactions by date range
     */
    public function getTransactionsByDateRange(string $startDate, string $endDate)
    {
        return $this->transactionRepository->getByDateRange($startDate, $endDate);
    }

    /**
     * Update account balance based on transaction type
     */
    protected function updateAccountBalance(string $accountId, string $entryType, float $amount): void
    {
        $account = $this->accountRepository->find($accountId);

        if (!$account) {
            throw new Exception("Account not found: {$accountId}");
        }

        // Determine if balance increases or decreases
        $increasesWithDebit = $account->increasesWithDebit();

        if ($entryType === 'debit') {
            $balanceChange = $increasesWithDebit ? $amount : -$amount;
        } else {
            $balanceChange = $increasesWithDebit ? -$amount : $amount;
        }

        $this->accountRepository->updateBalance($accountId, $balanceChange);
    }

    /**
     * Reverse account balance (for update/delete)
     */
    protected function reverseAccountBalance(string $accountId, string $entryType, float $amount): void
    {
        $account = $this->accountRepository->find($accountId);

        if (!$account) {
            throw new Exception("Account not found: {$accountId}");
        }

        $increasesWithDebit = $account->increasesWithDebit();

        if ($entryType === 'debit') {
            $balanceChange = $increasesWithDebit ? -$amount : $amount;
        } else {
            $balanceChange = $increasesWithDebit ? $amount : -$amount;
        }

        $this->accountRepository->updateBalance($accountId, $balanceChange);
    }

    /**
     * Get account ledger
     */
    public function getAccountLedger(string $accountId, ?string $startDate = null, ?string $endDate = null): array
    {
        $account = $this->accountRepository->find($accountId);

        if (!$account) {
            throw new Exception('Account not found');
        }

        $transactions = $this->getTransactionsByAccount($accountId, $startDate, $endDate);

        $ledger = [];
        $runningBalance = 0;

        foreach ($transactions as $transaction) {
            foreach ($transaction->details as $detail) {
                if ($detail->account_id == $accountId) {
                    $increasesWithDebit = $account->increasesWithDebit();

                    if ($detail->type === 'debit') {
                        $change = $increasesWithDebit ? $detail->amount : -$detail->amount;
                    } else {
                        $change = $increasesWithDebit ? -$detail->amount : $detail->amount;
                    }

                    $runningBalance += $change;

                    $ledger[] = [
                        'date' => $transaction->transaction_date,
                        'transaction_number' => $transaction->transaction_number,
                        'description' => $transaction->description,
                        'debit' => $detail->type === 'debit' ? $detail->amount : 0,
                        'credit' => $detail->type === 'credit' ? $detail->amount : 0,
                        'balance' => $runningBalance,
                    ];
                }
            }
        }

        return [
            'account' => $account,
            'entries' => $ledger,
            'final_balance' => $runningBalance,
        ];
    }
}
