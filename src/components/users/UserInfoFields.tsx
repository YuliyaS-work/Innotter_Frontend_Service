import React from "react";
import { UserResponse } from "../../api/user";
import "../../styles/users/UserInfoModal.scss";

interface Props {
  user: UserResponse;
}

export const UserInfoFields: React.FC<Props> = ({ user }) => {
  const fields = [
    { label: "Name:", value: user.name },
    { label: "Surname:", value: user.surname },
    { label: "Username:", value: `@${user.username}` },
    { label: "Email:", value: user.email },
    { label: "Phone:", value: user.phone_number || "N/A" },
    { label: "Group:", value: user.group?.group_name || "N/A" },
    {
      label: "Status:",
      value: user.is_blocked ? "Blocked" : "Active",
      className: user.is_blocked ? "blocked" : "active",
    },
    {
      label: "Roles:",
      value: user.roles.map((r) => r.role_name).join(", "),
      className: "roles",
    },
    {
      label: "Created:",
      value: new Date(user.created_at).toLocaleString(),
    },
    {
      label: "Updated:",
      value: new Date(user.modified_at).toLocaleString(),
    },
  ];

  return (
    <div className="user-info-fields">
      {fields.map((f, i) => (
        <div key={i} className="info-row">
          <span className="label">{f.label}</span>
          <span className={`value ${f.className || ""}`}>{f.value}</span>
        </div>
      ))}
    </div>
  );
};
