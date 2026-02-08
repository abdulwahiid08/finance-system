import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaMoneyBillWave, FaSignOutAlt } from "react-icons/fa";
import { Button } from "../common/Button";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FaMoneyBillWave size={24} className="text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">
              Keuangan APG
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              <FaSignOutAlt className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
