import React, { useState } from 'react';
import { patchMe } from '../api/user';
import { UserResponse, ProfileUserPatch } from '../api/user';

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
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Collect only changed fields
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Edit Profile</h3>

        {error && <div style={{ color: '#EB5757', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontSize: '14px' }}>Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontSize: '14px' }}>Surname</label>
            <input 
              type="text" 
              name="surname" 
              value={formData.surname || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontSize: '14px' }}>Email account</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontSize: '14px' }}>Mobile number</label>
            <input 
              type="text" 
              name="phone_number" 
              value={formData.phone_number || ''} 
              onChange={handleChange} 
              placeholder="Add number"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontSize: '14px' }}>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                flex: 1, 
                padding: '10px', 
                backgroundColor: '#ff6b00', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Saving...' : 'Submit'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#f2f2f2', 
                color: '#333', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};