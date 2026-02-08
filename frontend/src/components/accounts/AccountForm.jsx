import React from "react";
import { useForm } from "react-hook-form";
import {
  useCreateAccount,
  useUpdateAccount,
  useAccounts,
} from "../../hooks/useAccounts";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";

export const AccountForm = ({ account = null, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: account || {
      name: "",
      type: "",
      description: "",
      is_active: true,
      parent_id: "",
    },
  });

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const { data: accounts } = useAccounts();

  const isEditing = !!account;

  const onSubmit = (data) => {
    // Clean up data
    const submitData = {
      ...data,
      parent_id: data.parent_id ? data.parent_id : null,
      is_active: data.is_active === "true" || data.is_active === true,
    };

    if (isEditing) {
      updateAccount.mutate({ id: account.id, data: submitData }, { onSuccess });
    } else {
      createAccount.mutate(submitData, { onSuccess });
    }
  };

  const accountTypes = [
    { value: "asset", label: "Asset" },
    { value: "liability", label: "Liability" },
    { value: "equity", label: "Equity" },
    { value: "revenue", label: "Revenue" },
    { value: "expense", label: "Expense" },
  ];

  const parentOptions = [
    { value: "", label: "Pilih akun induk" },
    ...(accounts
      ?.filter((acc) => !acc.parent_id)
      .map((acc) => ({
        value: acc.id.toString(),
        label: `${acc.code} - ${acc.name}`,
      })) || []),
  ];

  const statusOptions = [
    { value: "true", label: "Aktif" },
    { value: "false", label: "Non Aktif" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nama Akun"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
        placeholder="cth: Kas Bank"
      />

      <Select
        label="Tipe Akun"
        {...register("type", { required: "Type is required" })}
        options={accountTypes}
        error={errors.type?.message}
        placeholder="Pilih tipe akun"
      />

      <Select
        label="Akun Induk"
        {...register("parent_id")}
        options={parentOptions}
      />

      <Input label="Deskripsi" {...register("description")} placeholder="..." />

      <Select
        label="Status"
        {...register("is_active")}
        options={statusOptions}
      />

      <div className="flex gap-3 justify-end mt-6">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={createAccount.isPending || updateAccount.isPending}
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};
