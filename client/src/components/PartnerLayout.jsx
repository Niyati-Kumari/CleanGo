import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/partner', label: 'Dashboard', end: true },
  { to: '/partner/orders', label: 'Orders' },
  { to: '/partner/prices', label: 'Prices' },
  { to: '/partner/earnings', label: 'Earnings' },
];

export default function PartnerLayout() {
  const { user, cleaner, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/partner" className="flex items-center gap-2 font-bold text-brand-700">
            <span className="text-2xl">🧺</span>
            <span>CleanGo Partner</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-slate-500 hover:text-brand-600">
              Customer app
            </Link>
            <span className="hidden text-slate-600 sm:inline">{cleaner?.shopName || user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="h-fit rounded-2xl border border-slate-200 bg-white p-3">
          <ul className="space-y-1">
            {NAV.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
