<?php

namespace App\Features\Transaction;

use App\Features\Account\Account;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    use HasUuid;

    // UUID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_id',
        'account_id',
        'type',
        'amount',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    const TYPE_DEBIT = 'debit';
    const TYPE_CREDIT = 'credit';

    /**
     * Get parent transaction
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get related account
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Scope for debit entries
     */
    public function scopeDebits($query)
    {
        return $query->where('type', self::TYPE_DEBIT);
    }

    /**
     * Scope for credit entries
     */
    public function scopeCredits($query)
    {
        return $query->where('type', self::TYPE_CREDIT);
    }

    /**
     * Check if this is a debit entry
     */
    public function isDebit(): bool
    {
        return $this->type === self::TYPE_DEBIT;
    }

    /**
     * Check if this is a credit entry
     */
    public function isCredit(): bool
    {
        return $this->type === self::TYPE_CREDIT;
    }
}
