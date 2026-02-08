<?php

namespace App\Features\Account;

use App\Core\BaseController;
use App\Features\Account\StoreAccountRequest;
use App\Features\Account\AccountService;
use App\Features\Account\AccountResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends BaseController
{
    public function __construct(
        protected AccountService $accountService
    ) {}

    /**
     * Get all accounts
     */
    public function index(): JsonResponse
    {
        try {
            $accounts = $this->accountService->getAllAccounts();
            return $this->successResponse(AccountResource::collection($accounts));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Get account hierarchy tree
     */
    public function tree(Request $request): JsonResponse
    {
        try {
            $type = $request->query('type');
            $tree = $this->accountService->getAccountTree($type);
            return $this->successResponse(AccountResource::collection($tree));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Get active accounts
     */
    public function active(): JsonResponse
    {
        try {
            $accounts = $this->accountService->getActiveAccounts();
            return $this->successResponse(AccountResource::collection($accounts));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Store new account
     */
    public function store(StoreAccountRequest $request): JsonResponse
    {
        try {
            $account = $this->accountService->createAccount($request->validated());
            return $this->createdResponse(
                new AccountResource($account),
                'Account created successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Show account detail
     */
    public function show(string $id): JsonResponse
    {
        try {
            $account = $this->accountService->getAccountById($id);

            if (!$account) {
                return $this->notFoundResponse('Account not found');
            }

            return $this->successResponse(new AccountResource($account));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Update account
     */
    public function update(StoreAccountRequest $request, string $id): JsonResponse
    {
        try {
            $result = $this->accountService->updateAccount($id, $request->validated());

            if (!$result) {
                return $this->errorResponse('Failed to update account', 500);
            }

            $account = $this->accountService->getAccountById($id);
            return $this->updatedResponse(new AccountResource($account));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Delete account
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->accountService->deleteAccount($id);
            return $this->deletedResponse();
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Toggle account status
     */
    public function toggleStatus(string $id): JsonResponse
    {
        try {
            $this->accountService->toggleStatus($id);
            $account = $this->accountService->getAccountById($id);
            return $this->successResponse(
                new AccountResource($account),
                'Account status updated'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Search accounts
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $keyword = $request->query('q', '');
            $accounts = $this->accountService->searchAccounts($keyword);
            return $this->successResponse(AccountResource::collection($accounts));
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Get balance summary
     */
    public function summary(): JsonResponse
    {
        try {
            $summary = $this->accountService->getBalanceSummary();
            return $this->successResponse($summary);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
