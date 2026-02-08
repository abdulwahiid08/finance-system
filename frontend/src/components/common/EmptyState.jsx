import React from "react";
import { FaInbox } from "react-icons/fa";

export const EmptyState = ({ title, message, icon, action }) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon || <FaInbox size={48} className="text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-500 mb-4">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
