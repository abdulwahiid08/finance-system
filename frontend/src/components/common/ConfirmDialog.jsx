import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FaExclamationTriangle } from "react-icons/fa";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  const colors = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle size={48} className={colors[variant]} />
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
