import React, { useEffect, useState, FormEvent } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { getUsersList } from '../../api/user';
import { UserResponse, UserFilter, GetUsersResponse } from '../../api/user';
import { UserAvatar } from '../../components/common/ModeratorUserAvatar';
import '../../styles/user/ModeratorPage.scss';

export const ModeratorPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтрация и пагинация
  const [filter, setFilter] = useState<UserFilter>({
    name: '',
    surname: '',
    sort_field: 'name',
    order_by: 'asc',
  });
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchModeratorUsers = async () => {
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

      // Извлекаем блок MODERATOR из ответа бэкенда
      if (response && response.MODERATOR) {
        const moderatorBlock = response.MODERATOR;
        setUsers(moderatorBlock.users || []);
        setTotalPages(moderatorBlock.total_pages || 1);
        setTotalUsers(moderatorBlock.total_users || 0);
      } else {
        setUsers([]);
        setError('No moderator permissions or data found.');
      }
    } catch (err: any) {
      console.error('Error fetching moderator users:', err);
      setError('Failed to load group users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModeratorUsers();
  }, [page, filter.sort_field, filter.order_by]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchModeratorUsers();
  };

  return (
    <div className="moderator-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab="moderator" />

      <main className="moderator-content" style={{ flex: 1, padding: '24px' }}>
        <header className="moderator-header">
          <h2>Group Users (Moderator View)</h2>
          <span className="total-count">Total users in group: {totalUsers}</span>
        </header>

        {/* Форма фильтрации */}
        <form className="moderator-filters" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by Name"
            value={filter.name || ''}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Surname"
            value={filter.surname || ''}
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

          <button type="submit" className="search-btn">
            Filter
          </button>
        </form>

        {/* Состояния загрузки и ошибок */}
        {loading && <div className="loading-state">Loading users list...</div>}
        {error && <div className="error-state">{error}</div>}

        {/* Таблица модерации */}
        {!loading && !error && (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Group</th>
                  <th>Roles</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <UserAvatar imagePath={u.image_s3_path} name={u.name} size={36} />
                      </td>
                      <td>
                        {u.name} {u.surname}
                      </td>
                      <td>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phone_number || 'N/A'}</td>
                      <td>{u.group?.group_name || 'No Group'}</td>
                      <td>
                        <div className="roles-column">
                          {u.roles.map((r) => (
                            <span key={r.id} className={`role-badge role-${r.role_name.toLowerCase()}`}>
                              {r.role_name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${u.is_blocked ? 'blocked' : 'active'}`}>
                          {u.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Элементы управления пагинацией */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};