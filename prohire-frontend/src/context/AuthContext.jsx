import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../api';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        if (!isMounted) return;
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        if (!isMounted) return;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      applySession: (session) => {
        localStorage.setItem('token', session.token);
        localStorage.setItem('user', JSON.stringify(session.user));
        setToken(session.token);
        setUser(session.user);
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      },
      refreshUser: async () => {
        const me = await getCurrentUser();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
        return me;
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
