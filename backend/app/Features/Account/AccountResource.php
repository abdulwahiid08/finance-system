<?php

namespace App\Features\Account;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'balance' => (float) $this->balance,
            'level' => $this->level,
            'parent_id' => $this->parent_id,
            'parent' => $this->when($this->parent, new AccountResource($this->parent)),
            'children' => AccountResource::collection($this->whenLoaded('children')),
            'full_path' => $this->full_path,
            'has_children' => $this->hasChildren(),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
