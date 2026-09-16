import React, { useEffect, useState } from "react";
import { getUserById, UserResponse } from "../../api/user";

import { UserInfoFields } from "./UserInfoFields";

import "../../styles/user/UserInfoModal.scss";

interface Props {
  userId: string;
  onClose: () => void;
}

export const UserInfoModal: React.FC<Props> = ({ userId, onClose }) => {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getUserById(userId);
      setUser(data);
    };
    load();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="user-info-modal-overlay">
      <div className="user-info-modal">

        {/* LEFT SIDE — avatar + name + email */}
        <div className="profile-left">
          <div className="avatar-circle">
            {user.name?.[0]?.toUpperCase()}
            {user.surname?.[0]?.toUpperCase()}
          </div>

          <h2 className="full-name">
            {user.name} {user.surname}
          </h2>

          <p className="email">{user.email}</p>
        </div>

        {/* RIGHT SIDE — fields */}
        <div className="profile-right">
          <UserInfoFields user={user} />
        </div>

        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};
