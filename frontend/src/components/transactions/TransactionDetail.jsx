import React from "react";
import { Badge } from "../common/Badge";
import { format } from "date-fns";

export const TransactionDetail = ({ transaction }) => {
  if (!transaction) return null;

  const totalDebit =
    transaction.details
      ?.filter((d) => d.type === "debit")
      .reduce((sum, d) => sum + d.amount, 0) || 0;

  const totalCredit =
    transaction.details
      ?.filter((d) => d.type === "credit")
      .reduce((sum, d) => sum + d.amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Transaction Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Transaction Number
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {transaction.transaction_number}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Date
          </label>
          <p className="mt-1 text-lg text-gray-900">
            {format(new Date(transaction.transaction_date), "MMMM dd, yyyy")}
          </p>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <p className="mt-1 text-gray-900">{transaction.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Total Amount
          </label>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            Rp. {transaction.total_amount.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Status
          </label>
          <div className="mt-1">
            <Badge variant={transaction.is_balanced ? "success" : "danger"}>
              {transaction.is_balanced ? "Balanced" : "Unbalanced"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Journal Entries
        </h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Account
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Notes
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                  Debit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transaction.details?.map((detail, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {detail.account.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {detail.account.code}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {detail.notes || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {detail.type === "debit" ? (
                      <span className="text-blue-600">
                        Rp. {detail.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {detail.type === "credit" ? (
                      <span className="text-green-600">
                        Rp. {detail.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Totals */}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">
                  Total
                </td>
                <td className="px-4 py-3 text-sm text-right text-blue-600">
                  Rp. {totalDebit.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right text-green-600">
                  Rp. {totalCredit.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Check */}
      <div
        className={`p-4 rounded-lg ${transaction.is_balanced ? "bg-green-50" : "bg-red-50"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Balance Check</p>
            <p className="text-sm text-gray-600">
              {transaction.is_balanced
                ? "Debit equals Credit - Transaction is balanced ✓"
                : "Debit does not equal Credit - Transaction is unbalanced ✗"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Difference</p>
            <p
              className={`text-xl font-bold ${transaction.is_balanced ? "text-green-600" : "text-red-600"}`}
            >
              Rp. {Math.abs(totalDebit - totalCredit).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-600">Created By</label>
            <p className="text-gray-900">
              {transaction.created_by?.name || "Unknown"}
            </p>
          </div>
          <div>
            <label className="block text-gray-600">Created At</label>
            <p className="text-gray-900">
              {format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
