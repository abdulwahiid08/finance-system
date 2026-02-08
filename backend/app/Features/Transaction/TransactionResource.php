<?php

namespace App\Features\Transaction;

use App\Features\Account\AccountResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'transaction_date' => $this->transaction_date->format('Y-m-d'),
            'description' => $this->description,
            'total_amount' => (float) $this->total_amount,
            'details' => $this->when($this->relationLoaded('details'), function () {
                return $this->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'account_id' => $detail->account_id,
                        'account' => new AccountResource($detail->account),
                        'type' => $detail->type,
                        'amount' => (float) $detail->amount,
                        'notes' => $detail->notes,
                    ];
                });
            }),
            'created_by' => $this->when($this->relationLoaded('creator'), [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'total_debit' => (float) $this->total_debit,
            'total_credit' => (float) $this->total_credit,
            'is_balanced' => $this->isBalanced(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
