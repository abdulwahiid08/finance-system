import React from "react";
import { useAccountSummary } from "../hooks/useAccounts";
import { useTransactions } from "../hooks/useTransactions";
import { Card } from "../components/common/Card";
import { Loading } from "../components/common/Loading";
import {
  FaWallet,
  FaHandHoldingUsd,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export const DashboardPage = () => {
  const { data: summary, isLoading: summaryLoading } = useAccountSummary();
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();

  if (summaryLoading || transactionsLoading) return <Loading />;

  const recentTransactions = transactions?.slice(0, 5) || [];

  // Calculate net income
  const netIncome = (summary?.revenue || 0) - (summary?.expense || 0);
  const totalAssets = summary?.asset || 0;
  const totalLiabilities = summary?.liability || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your financial status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Rp. {totalAssets.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaWallet size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Liabilities */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Rp. {totalLiabilities.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaHandHoldingUsd size={24} className="text-red-600" />
            </div>
          </div>
        </Card>

        {/* Net Income */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p
                className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                Rp. {Math.abs(netIncome).toLocaleString()}
              </p>
            </div>
            <div
              className={`${netIncome >= 0 ? "bg-green-100" : "bg-red-100"} p-3 rounded-full`}
            >
              {netIncome >= 0 ? (
                <FaArrowUp size={24} className="text-green-600" />
              ) : (
                <FaArrowDown size={24} className="text-red-600" />
              )}
            </div>
          </div>
        </Card>

        {/* Total Equity */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equity</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Rp. {(summary?.equity || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaChartLine size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-600">
                  {transaction.transaction_number}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  Rp. {transaction.total_amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
