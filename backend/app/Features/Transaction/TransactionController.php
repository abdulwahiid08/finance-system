<?php

namespace App\Features\Transaction;

use App\Core\BaseController;
use App\Features\Transaction\StoreTransactionRequest;
use App\Features\Transaction\TransactionService;
use App\Features\Transaction\TransactionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends BaseController
{
    public function __construct(
        protected TransactionService $transactionService
    ) {}

    public function index(): JsonResponse
    {
        try {
            $transactions = $this->transactionService->getAllTransactions();
            return $this->successResponse(TransactionResource::collection($transactions));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        try {
            $transaction = $this->transactionService->createTransaction($request->validated());
            return $this->createdResponse(
                new TransactionResource($transaction),
                'Transaction created successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $transaction = $this->transactionService->getTransactionById($id);

            if (!$transaction) {
                return $this->notFoundResponse('Transaction not found');
            }

            return $this->successResponse(new TransactionResource($transaction));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(StoreTransactionRequest $request, string $id): JsonResponse
    {
        try {
            $transaction = $this->transactionService->updateTransaction($id, $request->validated());
            return $this->updatedResponse(new TransactionResource($transaction));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->transactionService->deleteTransaction($id);
            return $this->deletedResponse();
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function filter(Request $request): JsonResponse
    {
        try {
            $filters = $request->all();
            $transactions = $this->transactionService->filterTransactions($filters);
            return $this->successResponse($transactions);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function ledger(string $accountId, Request $request): JsonResponse
    {
        try {
            $ledger = $this->transactionService->getAccountLedger(
                $accountId,
                $request->query('start_date'),
                $request->query('end_date')
            );
            return $this->successResponse($ledger);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
