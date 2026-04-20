'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('am_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (email: string) => {
    const u = { email, name: email.split('@')[0] };
    localStorage.setItem('am_auth', JSON.stringify(u));
    setIsLoggedIn(true);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('am_auth');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
