import React, { useState } from "react";
import { useAccountSummary, useAccounts } from "../hooks/useAccounts";
import { useAccountLedger } from "../hooks/useTransactions";
import { Card } from "../components/common/Card";
import { Loading } from "../components/common/Loading";
import { Button } from "../components/common/Button";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { Badge } from "../components/common/Badge";
import {
  FaFileAlt,
  FaBalanceScale,
  FaChartBar,
  FaBook,
  FaDownload,
} from "react-icons/fa";
import { format } from "date-fns";

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("balance-sheet");
  const [ledgerAccountId, setLedgerAccountId] = useState("");
  const [ledgerStartDate, setLedgerStartDate] = useState("");
  const [ledgerEndDate, setLedgerEndDate] = useState("");

  const { data: summary, isLoading: summaryLoading } = useAccountSummary();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: ledger, isLoading: ledgerLoading } = useAccountLedger(
    ledgerAccountId,
    ledgerStartDate,
    ledgerEndDate,
  );

  const tabs = [
    { id: "balance-sheet", label: "Balance Sheet", icon: FaBalanceScale },
    { id: "income-statement", label: "Income Statement", icon: FaChartBar },
    { id: "account-ledger", label: "Account Ledger", icon: FaBook },
    { id: "trial-balance", label: "Trial Balance", icon: FaFileAlt },
  ];

  if (summaryLoading || accountsLoading) return <Loading />;

  // Calculate values
  const totalAssets = summary?.asset || 0;
  const totalLiabilities = summary?.liability || 0;
  const totalEquity = summary?.equity || 0;
  const totalRevenue = summary?.revenue || 0;
  const totalExpense = summary?.expense || 0;
  const netIncome = totalRevenue - totalExpense;

  // Group accounts by type
  const groupedAccounts =
    accounts?.reduce((acc, account) => {
      if (!acc[account.type]) acc[account.type] = [];
      acc[account.type].push(account);
      return acc;
    }, {}) || {};

  const accountOptions =
    accounts?.map((acc) => ({
      value: acc.id.toString(),
      label: `${acc.code} - ${acc.name}`,
    })) || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Reports
          </h1>
          <p className="text-gray-600 mt-1">
            View and analyze your financial statements
          </p>
        </div>
        <Button variant="secondary" onClick={handlePrint}>
          <FaDownload className="mr-2" />
          Print / Export
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm
                  transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }
                `}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Balance Sheet */}
      {activeTab === "balance-sheet" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card title="Assets">
            <div className="space-y-2">
              {groupedAccounts.asset?.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.code}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    Rp. {account.balance.toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-900">Total Assets</p>
                  <p className="text-xl font-bold text-blue-600">
                    Rp. {totalAssets.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Liabilities & Equity */}
          <div className="space-y-6">
            {/* Liabilities */}
            <Card title="Liabilities">
              <div className="space-y-2">
                {groupedAccounts.liability?.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-500">{account.code}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rp. {account.balance.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-900">Total Liabilities</p>
                    <p className="text-xl font-bold text-red-600">
                      Rp. {totalLiabilities.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Equity */}
            <Card title="Equity">
              <div className="space-y-2">
                {groupedAccounts.equity?.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-500">{account.code}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rp. {account.balance.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-900">Total Equity</p>
                    <p className="text-xl font-bold text-purple-600">
                      Rp. {totalEquity.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Balance Check */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Accounting Equation
                  </p>
                  <p className="text-sm text-gray-600">
                    Assets = Liabilities + Equity
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Rp. {totalAssets.toLocaleString()} = Rp.
                    {totalLiabilities.toLocaleString()} + Rp.
                    {totalEquity.toLocaleString()}
                  </p>
                  <Badge
                    variant={
                      Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                      0.01
                        ? "success"
                        : "danger"
                    }
                  >
                    {Math.abs(totalAssets - (totalLiabilities + totalEquity)) <
                    0.01
                      ? "Balanced"
                      : "Unbalanced"}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Income Statement */}
      {activeTab === "income-statement" && (
        <div className="max-w-3xl mx-auto">
          <Card title="Income Statement">
            {/* Revenue */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Revenue
              </h3>
              <div className="space-y-2">
                {groupedAccounts.revenue?.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-500">{account.code}</p>
                    </div>
                    <p className="font-semibold text-green-600">
                      Rp. {account.balance.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-900">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      Rp. {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Expenses
              </h3>
              <div className="space-y-2">
                {groupedAccounts.expense?.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-500">{account.code}</p>
                    </div>
                    <p className="font-semibold text-red-600">
                      Rp. {account.balance.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-900">Total Expenses</p>
                    <p className="text-xl font-bold text-red-600">
                      Rp. {totalExpense.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div
              className={`p-4 rounded-lg ${netIncome >= 0 ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Net Income</p>
                <p
                  className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {netIncome >= 0 ? "+" : "-"}Rp.
                  {Math.abs(netIncome).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Revenue - Expenses = Net {netIncome >= 0 ? "Profit" : "Loss"}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Account Ledger */}
      {activeTab === "account-ledger" && (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Select Account"
                options={[
                  { value: "", label: "Choose an account..." },
                  ...accountOptions,
                ]}
                value={ledgerAccountId}
                onChange={(e) => setLedgerAccountId(e.target.value)}
              />
              <Input
                type="date"
                label="Start Date"
                value={ledgerStartDate}
                onChange={(e) => setLedgerStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={ledgerEndDate}
                onChange={(e) => setLedgerEndDate(e.target.value)}
              />
            </div>
          </Card>

          {ledgerAccountId && (
            <>
              {ledgerLoading ? (
                <Loading />
              ) : ledger ? (
                <Card
                  title={`Ledger: ${ledger.account.name} (${ledger.account.code})`}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                            Transaction #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                            Debit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                            Credit
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ledger.entries?.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {format(new Date(entry.date), "MMM dd, yyyy")}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {entry.transaction_number}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {entry.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">
                              {entry.debit > 0
                                ? `Rp. ${entry.debit.toLocaleString()}`
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                              {entry.credit > 0
                                ? `Rp. ${entry.credit.toLocaleString()}`
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              Rp. {entry.balance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-3 text-sm font-bold text-gray-900"
                          >
                            Final Balance
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                            Rp. {ledger.final_balance?.toLocaleString() || "0"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card>
              ) : null}
            </>
          )}
        </div>
      )}

      {/* Trial Balance */}
      {activeTab === "trial-balance" && (
        <Card title="Trial Balance">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Account Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                    Debit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts?.map((account) => {
                  const isDebitBalance =
                    account.balance >= 0 &&
                    ["asset", "expense"].includes(account.type);
                  const isCreditBalance =
                    account.balance >= 0 &&
                    ["liability", "equity", "revenue"].includes(account.type);

                  return (
                    <tr key={account.id}>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {account.code}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {account.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-blue-600 font-medium">
                        {isDebitBalance
                          ? `Rp. ${account.balance.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                        {isCreditBalance
                          ? `Rp. ${account.balance.toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}

                {/* Totals */}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="2" className="px-6 py-4 text-sm text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-blue-600">
                    Rp. {(totalAssets + totalExpense).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-green-600">
                    Rp.
                    {(
                      totalLiabilities +
                      totalEquity +
                      totalRevenue
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">Balance Check</p>
              <Badge
                variant={
                  Math.abs(
                    totalAssets +
                      totalExpense -
                      (totalLiabilities + totalEquity + totalRevenue),
                  ) < 0.01
                    ? "success"
                    : "danger"
                }
              >
                {Math.abs(
                  totalAssets +
                    totalExpense -
                    (totalLiabilities + totalEquity + totalRevenue),
                ) < 0.01
                  ? "Balanced"
                  : "Unbalanced"}
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
