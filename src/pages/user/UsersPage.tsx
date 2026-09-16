import React, { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { UsersLayout } from "../../components/user/UsersLayout";
import { getUsersList, GetUsersResponse, UserResponse } from "../../api/user";
import { UserAvatar } from "../../components/common/UserInfoAvatar";

import { EditUserModal } from "../../components/user/EditUserModal";
import { UserInfoModal } from "../../components/user/UserInfo";

import "../../styles/user/UsersPage.scss";
import "../../styles/user/UserInfoModal.scss";
import "../../styles/user/EditUserModal.scss";

interface UsersPageProps {
  role: "ADMIN" | "MODERATOR";
  title: string;
  showEdit?: boolean;
}

export const UsersPage: React.FC<UsersPageProps> = ({ role, title, showEdit }) => {
  const [filter, setFilter] = useState<{
    name: string;
    surname: string;
    sort_field: "name" | "surname";
    order_by: "asc" | "desc";
  }>({
    name: "",
    surname: "",
    sort_field: "name",
    order_by: "asc",
  });

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
  } = useQuery<GetUsersResponse>({
    queryKey: ["users", role, page, filter],
    queryFn: () =>
      getUsersList(
        {
          name: filter.name || undefined,
          surname: filter.surname || undefined,
          sort_field: filter.sort_field,
          order_by: filter.order_by,
        },
        { page, size: 10 }
      ),
    placeholderData: (prev) => prev, // заменяет keepPreviousData
  });

  const block = data?.[role] ?? { users: [], total_pages: 1 };
  const users: UserResponse[] = block.users;
  const totalPages = block.total_pages;

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilter({
      name: "",
      surname: "",
      sort_field: "name",
      order_by: "asc",
    });
    setPage(1);
  };

  return (
    <UsersLayout title={title} activeTab={role === "ADMIN" ? "admin" : "moderator"}>
      
      {/* Filters */}
      <form className="users-filters" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by Name"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Search by Surname"
          value={filter.surname}
          onChange={(e) => setFilter({ ...filter, surname: e.target.value })}
        />

        <select
          value={filter.sort_field}
          onChange={(e) =>
            setFilter({ ...filter, sort_field: e.target.value as "name" | "surname" })
          }
        >
          <option value="name">Sort by Name</option>
          <option value="surname">Sort by Surname</option>
        </select>

        <select
          value={filter.order_by}
          onChange={(e) =>
            setFilter({ ...filter, order_by: e.target.value as "asc" | "desc" })
          }
        >
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>

        <button type="submit" className="search-btn">Filter</button>
        <button type="button" className="reset-btn" onClick={handleResetFilters}>
          Reset
        </button>
      </form>

      {/* Loading / Error */}
      {isLoading && <div className="loading-state">Loading users list...</div>}
      {error && <div className="error-state">Failed to load users list.</div>}

      {/* Table */}
      {!isLoading && !error && (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Username</th>
                <th>Status</th>
                <th>View</th>
                {showEdit && <th>Edit</th>}
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((u: UserResponse) => (
                  <tr key={u.id}>
                    <td>
                      <UserAvatar imagePath={u.image_s3_path} name={u.name} size={36} />
                    </td>

                    <td>{u.name}</td>
                    <td>{u.surname}</td>
                    <td>@{u.username}</td>

                    <td>
                      <span className={`status-badge ${u.is_blocked ? "blocked" : "active"}`}>
                        {u.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-icon btn-view"
                        onClick={() => setViewUserId(u.id)}
                      >
                        <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 24 }}>
                          visibility
                        </span>
                      </button>
                    </td>

                    {showEdit && (
                      <td>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => setEditUserId(u.id)}
                        >
                          <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 24 }}>
                            edit_document
                          </span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showEdit ? 7 : 6} style={{ textAlign: "center", padding: "20px" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {viewUserId && (
        <UserInfoModal
          userId={viewUserId}
          onClose={() => setViewUserId(null)}
        />
      )}

      {/* Edit Modal */}
      {editUserId && showEdit && (
        <EditUserModal
          userId={editUserId}
          isOpen={true}
          onClose={() => setEditUserId(null)}
        />
      )}
    </UsersLayout>
  );
};
