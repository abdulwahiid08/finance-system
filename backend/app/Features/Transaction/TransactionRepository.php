<?php

namespace App\Features\Transaction;

use App\Core\BaseRepository;
use App\Features\Transaction\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Carbon\Carbon;

class TransactionRepository extends BaseRepository
{
    protected function makeModel(): Model
    {
        return new Transaction();
    }

    /**
     * Generate unique transaction number
     */
    public function generateTransactionNumber(): string
    {
        $date = Carbon::now();
        $prefix = 'TRX';
        $dateStr = $date->format('Ymd');

        // Get last transaction of today
        $lastTransaction = Transaction::whereDate('created_at', $date->toDateString())
            ->orderBy('transaction_number', 'desc')
            ->first();

        if ($lastTransaction) {
            $lastNumber = intval(substr($lastTransaction->transaction_number, -4));
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return "{$prefix}{$dateStr}{$nextNumber}";
    }

    /**
     * Get transactions with details
     */
    public function getAllWithDetails()
    {
        return $this->model
            ->with(['details.account', 'creator'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get transactions by date range
     */
    public function getByDateRange($startDate, $endDate): Collection
    {
        return $this->model
            ->with(['details.account', 'creator'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->orderBy('transaction_date', 'desc')
            ->get();
    }

    /**
     * Get transactions by account
     */
    public function getByAccount(string $accountId, ?string $startDate = null, ?string $endDate = null): Collection
    {
        $query = $this->model
            ->with(['details.account', 'creator'])
            ->whereHas('details', function ($q) use ($accountId) {
                $q->where('account_id', $accountId);
            });

        if ($startDate && $endDate) {
            $query->whereBetween('transaction_date', [$startDate, $endDate]);
        }

        return $query->orderBy('transaction_date', 'desc')->get();
    }

    /**
     * Filter transactions
     */
    public function filter(array $filters)
    {
        $query = $this->model->with(['details.account', 'creator']);

        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->whereBetween('transaction_date', [
                $filters['start_date'],
                $filters['end_date']
            ]);
        }

        if (isset($filters['account_id'])) {
            $query->whereHas('details', function ($q) use ($filters) {
                $q->where('account_id', $filters['account_id']);
            });
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('transaction_number', 'like', "%{$filters['search']}%")
                    ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get transaction with full details
     */
    public function getWithFullDetails(string $id): ?Transaction
    {
        return $this->model
            ->with(['details.account.parent', 'creator'])
            ->find($id);
    }

    /**
     * Delete transaction and its details
     */
    public function deleteTransaction(string $id): bool
    {
        $transaction = $this->find($id);

        if (!$transaction) {
            return false;
        }

        // Details will be cascade deleted
        return $transaction->delete();
    }

    /**
     * Get monthly summary
     */
    public function getMonthlySummary(int $year, int $month): array
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        $transactions = $this->getByDateRange(
            $startDate->toDateString(),
            $endDate->toDateString()
        );

        return [
            'total_transactions' => $transactions->count(),
            'total_amount' => $transactions->sum('total_amount'),
            'transactions' => $transactions,
        ];
    }
}
