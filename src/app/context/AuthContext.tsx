import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatarColor: string;
}

interface AuthContextType {
  user: User | null;
  login:      (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup:     (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout:     () => void;
  updateUser: (patch: Partial<Pick<User, 'name' | 'avatarColor'>>) => void;
  changePassword: (current: string, next: string) => { ok: boolean; error?: string };
}

const STORAGE_KEY  = 'wj_session';
const ACCOUNTS_KEY = 'wj_accounts';

export const AVATAR_COLORS = [
  '#007AFF', '#AF52DE', '#FF9500', '#34C759',
  '#FF2D55', '#5856D6', '#00C7BE', '#FF6B35',
];

function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // ── helpers ───────────────────────────────────────────────────────
  function getAccounts(): Record<string, { name: string; password: string; avatarColor: string }> {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveAccounts(accounts: Record<string, { name: string; password: string; avatarColor: string }>) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // ── actions ───────────────────────────────────────────────────────
  async function login(email: string, password: string) {
    const accounts = getAccounts();
    const key = email.trim().toLowerCase();
    const account = accounts[key];
    if (!account)           return { ok: false, error: 'No account found for that email.' };
    if (account.password !== password) return { ok: false, error: 'Incorrect password.' };
    setUser({ name: account.name, email: key, avatarColor: account.avatarColor });
    return { ok: true };
  }

  async function signup(name: string, email: string, password: string) {
    const accounts = getAccounts();
    const key = email.trim().toLowerCase();
    if (accounts[key]) return { ok: false, error: 'An account with that email already exists.' };
    const avatarColor = randomColor();
    accounts[key] = { name: name.trim(), password, avatarColor };
    saveAccounts(accounts);
    setUser({ name: name.trim(), email: key, avatarColor });
    return { ok: true };
  }

  function logout() { setUser(null); }

  function updateUser(patch: Partial<Pick<User, 'name' | 'avatarColor'>>) {
    if (!user) return;
    const updated = { ...user, ...patch };
    setUser(updated);
    // Also patch the stored account record
    const accounts = getAccounts();
    if (accounts[user.email]) {
      accounts[user.email] = { ...accounts[user.email], ...patch };
      saveAccounts(accounts);
    }
  }

  function changePassword(current: string, next: string): { ok: boolean; error?: string } {
    if (!user) return { ok: false, error: 'Not logged in.' };
    const accounts = getAccounts();
    const account  = accounts[user.email];
    if (!account)               return { ok: false, error: 'Account not found.' };
    if (account.password !== current) return { ok: false, error: 'Current password is incorrect.' };
    if (next.length < 6)        return { ok: false, error: 'New password must be at least 6 characters.' };
    accounts[user.email].password = next;
    saveAccounts(accounts);
    return { ok: true };
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
