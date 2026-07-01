import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DeliveryLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/delivery" className="text-xl font-bold text-brand-700">
                CleanGo Delivery
              </Link>
              <p className="text-sm text-slate-500">Partner Portal</p>
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

      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-6 flex gap-2 border-b border-slate-200 pb-4">
          <Link
            to="/delivery"
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            to="/delivery/deliveries"
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Deliveries
          </Link>
          <Link
            to="/delivery/earnings"
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Earnings
          </Link>
          <Link
            to="/delivery/profile"
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Profile
          </Link>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
