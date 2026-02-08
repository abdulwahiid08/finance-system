import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "../../hooks/useTransactions";
import { useActiveAccounts } from "../../hooks/useAccounts";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export const TransactionForm = ({ transaction = null, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: transaction || {
      transaction_date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const [entries, setEntries] = useState(
    transaction?.details?.map((d) => ({
      account_id: d.account_id,
      type: d.type,
      amount: d.amount,
      notes: d.notes || "",
    })) || [
      { account_id: "", type: "debit", amount: "", notes: "" },
      { account_id: "", type: "credit", amount: "", notes: "" },
    ],
  );

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { data: accounts } = useActiveAccounts();

  const isEditing = !!transaction;

  const addEntry = () => {
    setEntries([
      ...entries,
      { account_id: "", type: "debit", amount: "", notes: "" },
    ]);
  };

  const removeEntry = (index) => {
    if (entries.length > 2) {
      setEntries(entries.filter((_, i) => i !== index));
    } else {
      toast.error("Must have at least 2 entries");
    }
  };

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const onSubmit = (data) => {
    // Validate entries
    const validEntries = entries.filter((e) => e.account_id && e.amount);

    if (validEntries.length < 2) {
      toast.error("At least 2 entries required");
      return;
    }

    // Calculate totals
    const totalDebit = validEntries
      .filter((e) => e.type === "debit")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const totalCredit = validEntries
      .filter((e) => e.type === "credit")
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    // Check balance
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      toast.error(
        `Not balanced! Debit: Rp. ${totalDebit}, Credit: Rp. ${totalCredit}`,
      );
      return;
    }

    const submitData = {
      ...data,
      entries: validEntries.map((e) => ({
        account_id: e.account_id,
        type: e.type,
        amount: parseFloat(e.amount),
        notes: e.notes || null,
      })),
    };

    if (isEditing) {
      updateTransaction.mutate(
        { id: transaction.id, data: submitData },
        { onSuccess },
      );
    } else {
      createTransaction.mutate(submitData, { onSuccess });
    }
  };

  const accountOptions =
    accounts?.map((acc) => ({
      value: acc.id.toString(),
      label: `${acc.code} - ${acc.name}`,
    })) || [];

  const entryTypes = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
  ];

  // Calculate current balance
  const totalDebit = entries
    .filter((e) => e.type === "debit" && e.amount)
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalCredit = entries
    .filter((e) => e.type === "credit" && e.amount)
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Transaction Date"
          {...register("transaction_date", { required: "Date is required" })}
          error={errors.transaction_date?.message}
        />

        <div
          className={`p-4 rounded-lg ${isBalanced ? "bg-green-400" : "bg-red-400"}`}
        >
          <p className="text-sm font-medium">Balance Check</p>
          <div className="flex justify-between mt-1">
            <span className="text-sm">Debit: Rp. {totalDebit.toFixed(2)}</span>
            <span className="text-sm">
              Credit: Rp. {totalCredit.toFixed(2)}
            </span>
          </div>
          <p
            className={`text-xs mt-1 ${isBalanced ? "text-green-800" : "text-red-800"}`}
          >
            {isBalanced ? "✓ Balanced" : "✗ Not Balanced"}
          </p>
        </div>
      </div>

      <Input
        label="Description"
        {...register("description", { required: "Description is required" })}
        error={errors.description?.message}
        placeholder="e.g., Purchase office supplies"
      />

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Journal Entries <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addEntry}
          >
            <FaPlus className="mr-1" /> Add Entry
          </Button>
        </div>

        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg"
            >
              <div className="col-span-4">
                <Select
                  options={accountOptions}
                  placeholder="Select account"
                  value={entry.account_id}
                  onChange={(e) =>
                    updateEntry(index, "account_id", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <Select
                  options={entryTypes}
                  value={entry.type}
                  onChange={(e) => updateEntry(index, "type", e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={entry.amount}
                  onChange={(e) => updateEntry(index, "amount", e.target.value)}
                  required
                />
              </div>

              <div className="col-span-3">
                <Input
                  placeholder="Notes (optional)"
                  value={entry.notes}
                  onChange={(e) => updateEntry(index, "notes", e.target.value)}
                />
              </div>

              <div className="col-span-1 flex items-center">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeEntry(index)}
                  disabled={entries.length <= 2}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={createTransaction.isPending || updateTransaction.isPending}
          disabled={!isBalanced}
        >
          {isEditing ? "Update Transaction" : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
};
