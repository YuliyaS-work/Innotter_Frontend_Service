import React, { useEffect, useState, FormEvent } from 'react';
import { UsersLayout } from '../../components/users/UsersLayout';
import { getUsersList } from '../../api/user';
import { UserResponse, UserFilter, GetUsersResponse } from '../../api/user';
import { UserAvatar } from '../../components/common/UserInfoAvatar';

import { EditUserModal } from '../../components/users/EditUserModal';
import { UserInfoModal } from '../../components/users/UserInfo'
import '../../styles/users/UsersPage.scss';
import '../../styles/users/UserInfoModal.scss';
import '../../styles/users/EditUserModal.scss';

interface UsersPageProps {
  role: 'ADMIN' | 'MODERATOR';
  title: string;
  showEdit?: boolean;
}

export const UsersPage: React.FC<UsersPageProps> = ({ role, title, showEdit }) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<UserFilter>({
    name: '',
    surname: '',
    sort_field: 'name',
    order_by: 'asc',
  });

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: GetUsersResponse = await getUsersList(
        {
          name: filter.name || undefined,
          surname: filter.surname || undefined,
          sort_field: filter.sort_field,
          order_by: filter.order_by,
        },
        { page, size: 30 }
      );

      const block = response[role];

      if (block) {
        setUsers(block.users || []);
        setTotalPages(block.total_pages || 1);
        setTotalUsers(block.total_users || 0);
      } else {
        setUsers([]);
        setError('No permissions or data found.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filter.sort_field, filter.order_by]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setFilter({
      name: '',
      surname: '',
      sort_field: 'name',
      order_by: 'asc',
    });
    setPage(1);
    fetchUsers();
  };

  return (
    <UsersLayout title={title} activeTab={role === 'ADMIN' ? 'admin' : 'moderator'}>
      
      {/* Фильтры */}
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
            setFilter({ ...filter, sort_field: e.target.value as 'name' | 'surname' })
          }
        >
          <option value="name">Sort by Name</option>
          <option value="surname">Sort by Surname</option>
        </select>

        <select
          value={filter.order_by}
          onChange={(e) =>
            setFilter({ ...filter, order_by: e.target.value as 'asc' | 'desc' })
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
      {loading && <div className="loading-state">Loading users list...</div>}
      {error && <div className="error-state">{error}</div>}

      {/* Table */}
      {!loading && !error && (
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
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <UserAvatar imagePath={u.image_s3_path} name={u.name} size={36} />
                    </td>

                    <td>{u.name}</td>

                    <td>{u.surname}</td>

                    <td>@{u.username}</td>

                    <td>
                      <span className={`status-badge ${u.is_blocked ? 'blocked' : 'active'}`}>
                        {u.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-icon btn-view"
                        onClick={() => setViewUserId(u.id)}
                      >
                         <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>visibility</span>
                      </button>
                    </td>

                    {showEdit && (
                      <td>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => setEditUserId(u.id)}
                        >
                          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>edit_document</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showEdit ? 5 : 4} style={{ textAlign: 'center', padding: '20px' }}>
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

      {/* Modal to view user data */}
      {viewUserId && (
        <UserInfoModal
          userId={viewUserId}
          onClose={() => setViewUserId(null)}
        />
      )}

      {/* Modal to edit user data */}
      {editUserId && showEdit && (
        <EditUserModal
          userId={editUserId}
          isOpen={true}
          onClose={() => setEditUserId(null)}
          onSuccess={fetchUsers}
        />
      )}

    </UsersLayout>
  );
};