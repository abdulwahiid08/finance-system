import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transactionService";
import toast from "react-hot-toast";

/**
 * QUERY KEYS
 */
export const transactionKeys = {
  all: ["transactions"],
  lists: () => [...transactionKeys.all, "list"],
  list: (filters) => [...transactionKeys.lists(), filters],
  detail: (id) => [...transactionKeys.all, "detail", id],
  ledger: (accountId, startDate, endDate) => [
    ...transactionKeys.all,
    "ledger",
    accountId,
    startDate,
    endDate,
  ],
};

/**
 * Hook: Get all transactions
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: transactionService.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook: Filter transactions with pagination
 */
export const useFilteredTransactions = (filters) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.filter(filters),
    staleTime: 1 * 60 * 1000,
    keepPreviousData: true, // Keep previous data while fetching new
  });
};

/**
 * Hook: Get transaction by ID
 */
export const useTransaction = (id) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook: Get account ledger
 */
export const useAccountLedger = (
  accountId,
  startDate = null,
  endDate = null,
) => {
  return useQuery({
    queryKey: transactionKeys.ledger(accountId, startDate, endDate),
    queryFn: () => transactionService.getLedger(accountId, startDate, endDate),
    enabled: !!accountId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook: Create transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => transactionService.create(data),
    onSuccess: () => {
      // Invalidate all transaction queries and account queries (balance changed)
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transaction created successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create transaction";
      toast.error(message);
    },
  });
};

/**
 * Hook: Update transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => transactionService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transaction updated successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update transaction";
      toast.error(message);
    },
  });
};

/**
 * Hook: Delete transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Transaction deleted successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete transaction";
      toast.error(message);
    },
  });
};
