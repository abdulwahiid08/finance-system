<?php

namespace App\Features\Account;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasUuid;

    // UUID
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'type',
        'description',
        'is_active',
        'parent_id',
        'balance',
        'level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'balance' => 'decimal:2',
        'level' => 'integer',
    ];

    // Account Types Constants
    const TYPE_ASSET = 'asset';
    const TYPE_LIABILITY = 'liability';
    const TYPE_EQUITY = 'equity';
    const TYPE_REVENUE = 'revenue';
    const TYPE_EXPENSE = 'expense';

    // Account Code Prefixes
    const CODE_PREFIXES = [
        self::TYPE_ASSET => '1',
        self::TYPE_LIABILITY => '2',
        self::TYPE_EQUITY => '3',
        self::TYPE_REVENUE => '4',
        self::TYPE_EXPENSE => '5',
    ];

    /**
     * Get parent account
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    /**
     * Get child accounts
     */
    public function children(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    /**
     * Get all descendants (recursive)
     */
    public function descendants(): HasMany
    {
        return $this->children()->with('descendants');
    }

    /**
     * Get transaction details
     */
    public function transactionDetails(): HasMany
    {
        return $this->hasMany(\App\Features\Transaction\TransactionDetail::class);
    }

    /**
     * Scope for active accounts
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for parent accounts only
     */
    public function scopeParentsOnly($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope for child accounts only
     */
    public function scopeChildrenOnly($query)
    {
        return $query->whereNotNull('parent_id');
    }

    /**
     * Get full account path (parent > child > grandchild)
     */
    public function getFullPathAttribute(): string
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }

    /**
     * Check if account has children
     */
    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    /**
     * Check if this is a parent account
     */
    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Get debit balance increase types
     */
    public static function debitIncreaseTypes(): array
    {
        return [self::TYPE_ASSET, self::TYPE_EXPENSE];
    }

    /**
     * Get credit balance increase types
     */
    public static function creditIncreaseTypes(): array
    {
        return [self::TYPE_LIABILITY, self::TYPE_EQUITY, self::TYPE_REVENUE];
    }

    /**
     * Check if account balance increases with debit
     */
    public function increasesWithDebit(): bool
    {
        return in_array($this->type, self::debitIncreaseTypes());
    }
}
