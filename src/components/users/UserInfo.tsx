import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserById, UserResponse } from "../../api/user";

import { UserInfoFields } from "./UserInfoFields";

import "../../styles/users/UserInfoModal.scss";

interface Props {
  userId: string;
  onClose: () => void;
}

export const UserInfoModal: React.FC<Props> = ({ userId, onClose }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<UserResponse>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) return null;
  if (error || !user) return null;

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
