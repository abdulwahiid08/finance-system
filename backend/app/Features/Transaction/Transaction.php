<?php

namespace App\Features\Transaction;

use App\Features\User\User;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasUuid;

    // UUID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_number',
        'transaction_date',
        'description',
        'total_amount',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get transaction details
     */
    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }

    /**
     * Get creator user
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get debit entries
     */
    public function debits(): HasMany
    {
        return $this->details()->where('type', 'debit');
    }

    /**
     * Get credit entries
     */
    public function credits(): HasMany
    {
        return $this->details()->where('type', 'credit');
    }

    /**
     * Calculate total debit
     */
    public function getTotalDebitAttribute(): float
    {
        return (float) $this->debits()->sum('amount');
    }

    /**
     * Calculate total credit
     */
    public function getTotalCreditAttribute(): float
    {
        return (float) $this->credits()->sum('amount');
    }

    /**
     * Check if transaction is balanced (debit = credit)
     */
    public function isBalanced(): bool
    {
        return abs($this->total_debit - $this->total_credit) < 0.01;
    }

    /**
     * Scope for date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    /**
     * Scope for specific date
     */
    public function scopeOnDate($query, $date)
    {
        return $query->whereDate('transaction_date', $date);
    }
}
