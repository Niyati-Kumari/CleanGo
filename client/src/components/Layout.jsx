import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated, isCleaner } = useAuth();
  const { cartCount, city } = useBooking();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-xl shadow-lg group-hover:scale-105 transition-transform">
              🧺
            </div>
            <span className="text-2xl font-bold gradient-text">CleanGo</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 border border-brand-100">
              <span>📍</span>
              <span>{city}</span>
            </span>
            
            {cartCount > 0 && (
              <Link
                to="/cleaners"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg hover:scale-105 transition-transform"
              >
                <span>🛒</span>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isCleaner ? (
                  <Link
                    to="/partner"
                    className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <span>🏪</span>
                    <span>Partner Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/orders"
                    className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <span>📋</span>
                    <span>My Orders</span>
                  </Link>
                )}
                
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-50 to-accent-50 px-4 py-2 border border-brand-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0]}</span>
                </div>
                
                <button
                  type="button"
                  onClick={logout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  →
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/partner/register"
                  className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
                >
                  <span>🏪</span>
                  <span>Become a Partner</span>
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-brand-700 hover:to-brand-600 transition-all"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      
      <footer className="mt-16 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧺</span>
                <span className="text-xl font-bold gradient-text">CleanGo</span>
              </div>
              <p className="text-sm text-slate-600">
                Professional laundry & dry cleaning at your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Clothes</li>
                <li>Shoes</li>
                <li>Bags</li>
                <li>Sofa Cleaning</li>
                <li>Curtains</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/partner/register" className="hover:text-brand-600">Become a Partner</Link></li>
                <li><Link to="/delivery/register" className="hover:text-brand-600">Join as Driver</Link></li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Admin</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/login" className="hover:text-brand-600">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            © 2024 CleanGo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
