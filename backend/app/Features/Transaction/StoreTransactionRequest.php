<?php

namespace App\Features\Transaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'entries' => ['required', 'array', 'min:2'],
            'entries.*.account_id' => ['required', 'exists:accounts,id'],
            'entries.*.type' => ['required', 'in:debit,credit'],
            'entries.*.amount' => ['required', 'numeric', 'min:0.01'],
            'entries.*.notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'transaction_date.required' => 'Tanggal transaksi harus diisi',
            'description.required' => 'Deskripsi harus diisi',
            'entries.required' => 'Minimal harus ada 2 entry',
            'entries.min' => 'Minimal harus ada 2 entry (debit dan credit)',
            'entries.*.account_id.required' => 'Akun harus dipilih',
            'entries.*.account_id.exists' => 'Akun tidak ditemukan',
            'entries.*.type.required' => 'Tipe entry harus dipilih',
            'entries.*.type.in' => 'Tipe entry harus debit atau credit',
            'entries.*.amount.required' => 'Amount harus diisi',
            'entries.*.amount.numeric' => 'Amount harus berupa angka',
            'entries.*.amount.min' => 'Amount minimal 0.01',
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
