import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin" className="text-xl font-bold text-brand-700">
                CleanGo Admin
              </Link>
              <p className="text-sm text-slate-500">Platform Management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="mb-6 flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          <Link
            to="/admin"
            className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-slate-100"
          >
            Users
          </Link>
          <Link
            to="/admin/cleaners"
            className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-slate-100"
          >
            Cleaners
          </Link>
          <Link
            to="/admin/delivery-partners"
            className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-slate-100"
          >
            Delivery Partners
          </Link>
          <Link
            to="/admin/orders"
            className="rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-slate-100"
          >
            Orders
          </Link>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
