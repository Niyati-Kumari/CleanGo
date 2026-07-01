import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cleaner, setCleaner] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    const token = localStorage.getItem('cleango_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { user: me, cleaner: profile } = await api.getMe();
      setUser(me);
      setCleaner(profile || null);
    } catch {
      localStorage.removeItem('cleango_token');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      cleaner,
      loading,
      isAuthenticated: Boolean(user),
      isCleaner: user?.role === 'cleaner',
      isDelivery: user?.role === 'delivery',
      isAdmin: user?.role === 'admin',
      async login(credentials) {
        const { token, user: loggedIn } = await api.login(credentials);
        localStorage.setItem('cleango_token', token);
        setUser(loggedIn);
        const session = await api.getMe();
        setCleaner(session.cleaner || null);
        return loggedIn;
      },
      async register(payload) {
        const { token, user: registered } = await api.register(payload);
        localStorage.setItem('cleango_token', token);
        setUser(registered);
        setCleaner(null);
        return registered;
      },
      async partnerRegister(payload) {
        const { token, user: registered, cleaner: profile } = await api.partnerRegister(payload);
        localStorage.setItem('cleango_token', token);
        setUser(registered);
        setCleaner(profile);
        return { user: registered, cleaner: profile };
      },
      async refreshProfile() {
        const session = await api.getMe();
        setUser(session.user);
        setCleaner(session.cleaner || null);
        return session;
      },
      logout() {
        localStorage.removeItem('cleango_token');
        setUser(null);
        setCleaner(null);
      },
    }),
    [user, cleaner, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
