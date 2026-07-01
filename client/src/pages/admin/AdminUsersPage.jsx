import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = () => {
    setLoading(true);
    api.adminUsers(filter ? { role: filter } : {})
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Users</h1>

      <div className="mb-4 flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="cleaner">Cleaners</option>
          <option value="delivery">Delivery Partners</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="px-4 py-8 text-center text-slate-500">No users found</p>
          )}
        </div>
      )}
    </div>
  );
}
