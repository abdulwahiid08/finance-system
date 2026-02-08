import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "../services/accountService";
import toast from "react-hot-toast";

/**
 * QUERY KEYS
 * Centralized query keys untuk consistency
 */
export const accountKeys = {
  all: ["accounts"],
  lists: () => [...accountKeys.all, "list"],
  list: (filters) => [...accountKeys.lists(), { filters }],
  tree: (type) => [...accountKeys.all, "tree", type],
  active: () => [...accountKeys.all, "active"],
  detail: (id) => [...accountKeys.all, "detail", id],
  summary: () => [...accountKeys.all, "summary"],
};

/**
 * Hook: Get all accounts
 */
export const useAccounts = () => {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: accountService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook: Get account tree hierarchy
 */
export const useAccountTree = (type = null) => {
  return useQuery({
    queryKey: accountKeys.tree(type),
    queryFn: () => accountService.getTree(type),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Get active accounts
 */
export const useActiveAccounts = () => {
  return useQuery({
    queryKey: accountKeys.active(),
    queryFn: accountService.getActive,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook: Get account by ID
 */
export const useAccount = (id) => {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getById(id),
    enabled: !!id, // Only run query if id exists
  });
};

/**
 * Hook: Get account summary
 */
export const useAccountSummary = () => {
  return useQuery({
    queryKey: accountKeys.summary(),
    queryFn: accountService.getSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook: Create account
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => accountService.create(data),
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create account";
      toast.error(message);
    },
  });
};

/**
 * Hook: Update account
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => accountService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific account and list
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Account updated successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update account";
      toast.error(message);
    },
  });
};

/**
 * Hook: Delete account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      toast.success("Account deleted successfully!");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete account";
      toast.error(message);
    },
  });
};

/**
 * Hook: Toggle account status
 */
export const useToggleAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => accountService.toggleStatus(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });

      const status = data.is_active ? "activated" : "deactivated";
      toast.success(`Account ${status} successfully!`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to toggle status";
      toast.error(message);
    },
  });
};

/**
 * Hook: Search accounts
 */
export const useSearchAccounts = (keyword, debounceMs = 300) => {
  return useQuery({
    queryKey: [...accountKeys.all, "search", keyword],
    queryFn: () => accountService.search(keyword),
    enabled: keyword.length > 0,
    staleTime: 1 * 60 * 1000,
  });
};
