import React, { useState } from "react";
import {
  useTransactions,
  useFilteredTransactions,
  useDeleteTransaction,
} from "../hooks/useTransactions";
import { useActiveAccounts } from "../hooks/useAccounts";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { TransactionDetail } from "../components/transactions/TransactionDetail";
import { Modal } from "../components/common/Modal";
import { Loading } from "../components/common/Loading";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Badge } from "../components/common/Badge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { EmptyState } from "../components/common/EmptyState";
import { Card } from "../components/common/Card";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { format } from "date-fns";

export const TransactionsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    account_id: "",
    search: "",
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: accounts } = useActiveAccounts();
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = () => {
    if (deletingId) {
      deleteTransaction.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      account_id: "",
      search: "",
      per_page: 10,
    });
  };

  // Apply filters
  const filteredTransactions =
    transactions?.filter((transaction) => {
      let match = true;

      // Filter by date range
      if (filters.start_date) {
        match = match && transaction.transaction_date >= filters.start_date;
      }
      if (filters.end_date) {
        match = match && transaction.transaction_date <= filters.end_date;
      }

      // Filter by account
      if (filters.account_id) {
        const hasAccount = transaction.details?.some(
          (detail) => detail.account_id === filters.account_id,
        );
        match = match && hasAccount;
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        match =
          match &&
          (transaction.description.toLowerCase().includes(searchLower) ||
            transaction.transaction_number.toLowerCase().includes(searchLower));
      }

      return match;
    }) || [];

  if (isLoading) return <Loading />;

  const accountOptions = [
    { value: "", label: "All Accounts" },
    ...(accounts?.map((acc) => ({
      value: acc.id.toString(),
      label: `${acc.code} - ${acc.name}`,
    })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Manage your financial transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <FaPlus className="mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
            />

            <Input
              type="date"
              label="End Date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
            />

            <Select
              label="Account"
              options={accountOptions}
              value={filters.account_id}
              onChange={(e) => handleFilterChange("account_id", e.target.value)}
            />

            <Input
              label="Search"
              placeholder="Search trx number or description"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          message={
            filters.search || filters.account_id || filters.start_date
              ? "Try adjusting your filters"
              : "Create your first transaction to get started"
          }
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <FaPlus className="mr-2" />
              New Transaction
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(
                        new Date(transaction.transaction_date),
                        "MMM dd, yyyy",
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.transaction_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      Rp. {transaction.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={transaction.is_balanced ? "success" : "danger"}
                        size="sm"
                      >
                        {transaction.is_balanced ? "Balanced" : "Unbalanced"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setViewingTransaction(transaction)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingTransaction(transaction)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeletingId(transaction.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredTransactions.length} transaction(s)
              </p>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  Rp.
                  {filteredTransactions
                    .reduce((sum, t) => sum + t.total_amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Transaction"
        size="xl"
      >
        <TransactionForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
        size="xl"
      >
        {editingTransaction && (
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={() => setEditingTransaction(null)}
          />
        )}
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={!!viewingTransaction}
        onClose={() => setViewingTransaction(null)}
        title="Transaction Details"
        size="lg"
      >
        {viewingTransaction && (
          <TransactionDetail transaction={viewingTransaction} />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This will reverse all account balances. This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleteTransaction.isPending}
      />
    </div>
  );
};
