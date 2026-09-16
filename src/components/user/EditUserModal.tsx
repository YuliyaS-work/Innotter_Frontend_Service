import React from "react";
import { EditUserForm } from "./EditUserForm";
import { useEditUserData } from "./useEditUserData";

export const EditUserModal = ({ userId, isOpen, onClose, onSuccess }: any) => {
  const { user, formData, setFormData, toggleRole, submit, saving, error } =
    useEditUserData(userId, onSuccess, onClose);

  if (!isOpen || !user || !formData) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-vertical">
        <EditUserForm
          formData={formData}
          setFormData={setFormData}
          toggleRole={toggleRole}
          submit={submit}
          saving={saving}
          error={error}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
