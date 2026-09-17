import React, { useState } from 'react';
import { patchMe } from '../../api/user';
import { UserResponse, ProfileUserPatch } from '../../api/user';

import '../../styles/profile/EditProfileModal.scss';

interface EditProfileModalProps {
  user: UserResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: UserResponse) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ProfileUserPatch>({
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    phone_number: user.phone_number || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const changedFields: ProfileUserPatch = {};

    if (formData.name !== user.name) changedFields.name = formData.name;
    if (formData.surname !== user.surname) changedFields.surname = formData.surname;
    if (formData.username !== user.username) changedFields.username = formData.username;
    if (formData.email !== user.email) changedFields.email = formData.email;
    if (formData.phone_number !== user.phone_number) changedFields.phone_number = formData.phone_number;

    if (Object.keys(changedFields).length === 0) {
      onClose();
      setSaving(false);
      return;
    }

    try {
      const updatedUser = await patchMe(changedFields);
      onSuccess(updatedUser);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h3 className="edit-modal-title">Edit Profile</h3>

        {error && <div className="edit-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="edit-field">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Surname</label>
            <input type="text" name="surname" value={formData.surname} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Email account</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="edit-field">
            <label>Mobile number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Add number"
            />
          </div>

          <div className="edit-field">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>

          <div className="edit-modal-actions">
            <button type="submit" disabled={saving} className="edit-btn-save">
              {saving ? 'Saving...' : 'Submit'}
            </button>

            <button type="button" onClick={onClose} className="edit-btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};