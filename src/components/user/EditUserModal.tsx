import React from "react";
import { EditUserForm } from "./EditUserForm";
import { useEditUserData } from "./useEditUserData";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditUserModal: React.FC<Props> = ({ userId, isOpen, onClose }) => {
  const {
    user,
    isLoading,
    formData,
    setFormData,
    toggleRole,
    submit,
    saving,
    error,
  } = useEditUserData(userId, onClose);

  if (!isOpen) return null;
  if (isLoading || !user || !formData) return null;

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
