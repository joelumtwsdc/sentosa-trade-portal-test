import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Agent } from '../types';
import { mockAgent, LOGIN_EMAIL, LOGIN_PASSWORD } from '../data';

interface AuthContextValue {
  isAuthenticated: boolean;
  agent: Agent | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'stp_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (agent) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(agent));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [agent]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
      setAgent(mockAgent);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAgent(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: agent !== null, agent, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
