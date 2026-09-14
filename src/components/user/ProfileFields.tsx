import React from 'react';
import { UserResponse } from '../../api/user';
import '../../styles/user/Profile.scss';

interface ProfileFieldsProps {
  user: UserResponse;
}

export const ProfileFields: React.FC<ProfileFieldsProps> = ({ user }) => {
  const fields = [
    { label: 'Name:', value: `${user.name || ''}` },
    { label: 'Surname:', value: `${user.surname || ''}` },
    { label: 'Email:', value: user.email },
    { label: 'Mobile number:', value: user.phone_number || 'Add number' },
    { label: 'Username:', value: `@${user.username || ''}` },
  ];

  return (
    <div className="profile-fields">
      {fields.map((field, index) => (
        <div key={index} className="profile-field-row">
          <span className="profile-field-label">{field.label}</span>
          <strong className="profile-field-value">{field.value}</strong>
        </div>
      ))}
    </div>
  );
};