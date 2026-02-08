import React, { useState } from "react";
import {
  useAccounts,
  useDeleteAccount,
  useToggleAccountStatus,
} from "../hooks/useAccounts";
import { AccountForm } from "../components/accounts/AccountForm";
import { Modal } from "../components/common/Modal";
import { Loading } from "../components/common/Loading";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { EmptyState } from "../components/common/EmptyState";
import { Card } from "../components/common/Card";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";

export const AccountsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: accounts, isLoading } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const toggleStatus = useToggleAccountStatus();

  const handleDelete = () => {
    if (deletingId) {
      deleteAccount.mutate(deletingId, {
        onSuccess: () => setDeletingId(null),
      });
    }
  };

  const handleToggleStatus = (id) => {
    toggleStatus.mutate(id);
  };

  if (isLoading) return <Loading />;

  // Group accounts by type
  const groupedAccounts =
    accounts?.reduce((acc, account) => {
      if (!acc[account.type]) acc[account.type] = [];
      acc[account.type].push(account);
      return acc;
    }, {}) || {};

  const accountTypes = [
    { key: "asset", label: "Assets", color: "blue" },
    { key: "liability", label: "Liabilities", color: "red" },
    { key: "equity", label: "Equity", color: "purple" },
    { key: "revenue", label: "Revenue", color: "green" },
    { key: "expense", label: "Expenses", color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chart of Accounts
          </h1>
          <p className="text-gray-600 mt-1">Manage your account structure</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <FaPlus className="mr-2" />
          Add Account
        </Button>
      </div>

      {/* Accounts by Type */}
      {accounts?.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          message="Create your first account to get started"
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <FaPlus className="mr-2" />
              Add Account
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {accountTypes.map((type) => {
            const typeAccounts = groupedAccounts[type.key] || [];
            if (typeAccounts.length === 0) return null;

            return (
              <Card key={type.key} title={type.label}>
                <div className="space-y-2">
                  {typeAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {account.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {account.code}
                          </span>
                          <Badge
                            variant={account.is_active ? "success" : "danger"}
                            size="sm"
                          >
                            {account.is_active ? "Aktif" : "Non Aktif"}
                          </Badge>
                        </div>
                        {account.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {account.description}
                          </p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-gray-600">
                            Balance:{" "}
                            <strong>
                              Rp. {account.balance.toLocaleString()}
                            </strong>
                          </span>
                          {account.parent && (
                            <span className="text-gray-600">
                              Akun Induk: <strong>{account.parent.name}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleToggleStatus(account.id)}
                          title={account.is_active ? "Deactivate" : "Activate"}
                        >
                          {account.is_active ? <FaToggleOn /> : <FaToggleOff />}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingAccount(account)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeletingId(account.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Account"
      >
        <AccountForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title="Edit Account"
      >
        {editingAccount && (
          <AccountForm
            account={editingAccount}
            onSuccess={() => setEditingAccount(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleteAccount.isPending}
      />
    </div>
  );
};
