<?php

namespace App\Features\Account;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(array_keys(Account::CODE_PREFIXES))],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama akun harus diisi',
            'type.required' => 'Tipe akun harus dipilih',
            'type.in' => 'Tipe akun tidak valid',
            'parent_id.exists' => 'Akun induk tidak ditemukan',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
