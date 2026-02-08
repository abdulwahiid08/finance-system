import React from "react";

export const Card = ({ children, title, className = "", padding = true }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={padding ? "p-6" : ""}>{children}</div>
    </div>
  );
};
