import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaWallet, FaExchangeAlt, FaChartLine } from "react-icons/fa";

export const Sidebar = () => {
  const links = [
    { to: "/dashboard", icon: FaHome, label: "Dashboard" },
    { to: "/accounts", icon: FaWallet, label: "Accounts" },
    { to: "/transactions", icon: FaExchangeAlt, label: "Transactions" },
    { to: "/reports", icon: FaChartLine, label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
