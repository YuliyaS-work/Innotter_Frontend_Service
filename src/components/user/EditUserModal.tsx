import React, { useEffect, useState } from "react";
import { getUserById, patchUserById, UserResponse } from "../../api/user";
import "../../styles/user/EditProfileModal.scss";

interface EditUserModalProps {
  userId: string;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

type AdminEditForm = {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone_number: string;
  group_id: number | null;
  is_blocked: boolean;
  roles_id: number[];
};

export const EditUserModal: React.FC<EditUserModalProps> = ({
  userId,
  isOpen = true,
  onClose,
  onSuccess,
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<AdminEditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadUser = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);

        setFormData({
          name: data.name,
          surname: data.surname,
          username: data.username,
          email: data.email,
          phone_number: data.phone_number || "",
          group_id: (data as any).group_id ?? null,
          is_blocked: data.is_blocked,
          roles_id: (data.roles || []).map((r: any) => r.id), // IMPORTANT
        });
      } catch {
        setError("Failed to load user");
      }
    };

    loadUser();
  }, [userId, isOpen]);

  if (!isOpen || !user || !formData) return null;

  const toggleRole = (roleId: number) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const hasRole = prev.roles_id.includes(roleId);
      const newRoles = hasRole
        ? prev.roles_id.filter((id) => id !== roleId)
        : [...prev.roles_id, roleId];

      // USER = id 1 (пример)
      if (!newRoles.includes(1)) newRoles.push(1);

      return { ...prev, roles_id: newRoles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const changedFields: any = {};

    if (formData.name !== user.name) changedFields.name = formData.name;
    if (formData.surname !== user.surname) changedFields.surname = formData.surname;
    if (formData.username !== user.username) changedFields.username = formData.username;
    if (formData.email !== user.email) changedFields.email = formData.email;

    if (formData.phone_number !== (user.phone_number || "")) {
      changedFields.phone_number = formData.phone_number;
    }

    if (formData.group_id !== (user as any).group_id) {
      changedFields.group_id = formData.group_id;
    }

    if (formData.is_blocked !== user.is_blocked) {
      changedFields.is_blocked = formData.is_blocked;
    }

    const originalRoles = (user.roles || []).map((r: any) => r.id);
    if (JSON.stringify(formData.roles_id) !== JSON.stringify(originalRoles)) {
      changedFields.roles_id = formData.roles_id;
    }

    if (Object.keys(changedFields).length === 0) {
      setSaving(false);
      onClose();
      return;
    }

    try {
      await patchUserById(user.id, changedFields);
      await onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else if (typeof detail === "object") {
        setError(detail.msg || "Failed to update user");
      } else {
        setError("Failed to update user");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-vertical">

        <h3 className="edit-modal-title">Edit User (Admin)</h3>

        {error && <div className="edit-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-modal-form-two-columns">

          {/* LEFT COLUMN */}
          <div className="edit-column">
            <div className="edit-field">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Surname</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Mobile number</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="edit-column">
            <div className="edit-field">
              <label>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="edit-field">
              <label>Group ID</label>
              <input
                type="number"
                value={formData.group_id ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, group_id: Number(e.target.value) })
                }
              />
            </div>

            <div className="edit-field">
              <label>Status</label>
              <select
                value={formData.is_blocked ? "blocked" : "active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_blocked: e.target.value === "blocked",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="edit-field">
              <label>Roles</label>
              <div className="roles-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.roles_id.includes(2)}
                    onChange={() => toggleRole(2)}
                  />
                  Moderator
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={formData.roles_id.includes(3)}
                    onChange={() => toggleRole(3)}
                  />
                  Admin
                </label>
              </div>
            </div>
          </div>

          {/* BUTTONS UNDER ALL FIELDS, RIGHT SIDE */}
          <div className="edit-modal-actions-bottom">
            <button type="submit" disabled={saving} className="edit-btn-save">
              {saving ? "Saving..." : "Submit"}
            </button>

            <button type="button" onClick={onClose} className="edit-btn-cancel">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
