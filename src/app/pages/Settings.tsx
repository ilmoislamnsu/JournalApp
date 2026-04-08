import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, User, Palette, Shield, Database,
  Info, Check, Eye, EyeOff, Download, Trash2,
  Moon, Sun, LogOut, AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, AVATAR_COLORS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStorage } from '../hooks/useStorage';
import { useBook } from '../context/BookContext';

// ── small helpers ────────────────────────────────────────────────
function Initials({ name, color }: { name: string; color: string }) {
  const parts = name.trim().split(' ');
  const ini   = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return (
    <span className="size-14 rounded-full flex items-center justify-center text-xl font-bold text-white select-none"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, boxShadow: `0 4px 16px ${color}55` }}>
      {ini.toUpperCase()}
    </span>
  );
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
      style={{
        background: type === 'success' ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)',
        border: `0.5px solid ${type === 'success' ? 'rgba(52,199,89,0.4)' : 'rgba(255,59,48,0.4)'}`,
        color: type === 'success' ? '#34c759' : '#ff3b30',
      }}>
      {type === 'success' ? <Check className="size-4" /> : <AlertTriangle className="size-4" />}
      {message}
    </motion.div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────
function Section({ icon, title, children, isDark }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; isDark: boolean;
}) {
  return (
    <div className="mb-6"
      style={{
        borderRadius: '18px',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        background: isDark ? 'rgba(30,30,34,0.72)' : 'rgba(255,255,255,0.72)',
        border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
        overflow: 'hidden',
      }}>
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-5 py-4"
        style={{ borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}` }}>
        <span style={{ color: '#007AFF' }}>{icon}</span>
        <span className="text-sm font-semibold tracking-tight"
          style={{ color: isDark ? '#f2f2f7' : '#1c1c1e' }}>{title}</span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────
function Row({ label, sublabel, children, isDark }: {
  label: string; sublabel?: string; children?: React.ReactNode; isDark: boolean;
}) {
  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium" style={{ color: textPrimary }}>{label}</div>
        {sublabel && <div className="text-xs mt-0.5" style={{ color: textSecondary }}>{sublabel}</div>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative flex-shrink-0 transition-all duration-200"
      style={{ width: 44, height: 26, borderRadius: 13,
        background: value ? '#007AFF' : 'rgba(120,120,128,0.32)',
        boxShadow: value ? '0 0 0 0 rgba(0,122,255,0)' : 'none' }}>
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────
function Input({ value, onChange, type = 'text', placeholder, isDark, right }: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; isDark: boolean; right?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-xl outline-none transition-all"
        style={{
          padding: right ? '10px 44px 10px 14px' : '10px 14px',
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
          border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
          color: isDark ? '#f2f2f7' : '#1c1c1e',
        }} />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, changePassword, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const storage  = useStorage();
  const { books, refreshBooks } = useBook();
  const isDark   = theme === 'dark';

  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';

  // Profile state
  const [displayName, setDisplayName]   = useState(user?.name ?? '');
  const [avatarColor, setAvatarColor]   = useState(user?.avatarColor ?? AVATAR_COLORS[0]);

  // Security state
  const [currentPass, setCurrentPass]   = useState('');
  const [newPass, setNewPass]           = useState('');
  const [confirmPass, setConfirmPass]   = useState('');
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);

  // Data state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Profile save ─────────────────────────────────────────────
  function handleSaveProfile() {
    if (!displayName.trim()) { showToast('Name cannot be empty.', 'error'); return; }
    updateUser({ name: displayName.trim(), avatarColor });
    showToast('Profile updated successfully.', 'success');
  }

  // ── Password change ──────────────────────────────────────────
  function handleChangePassword() {
    if (!currentPass || !newPass || !confirmPass) {
      showToast('Please fill in all password fields.', 'error'); return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match.', 'error'); return;
    }
    const result = changePassword(currentPass, newPass);
    if (result.ok) {
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
      showToast('Password changed successfully.', 'success');
    } else {
      showToast(result.error ?? 'Failed to change password.', 'error');
    }
  }

  // ── Export data ──────────────────────────────────────────────
  function handleExport() {
    const allBooks   = storage.getBooks();
    const allEntries = storage.getEntries();
    const blob = new Blob([JSON.stringify({ books: allBooks, entries: allEntries }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `web-journal-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully.', 'success');
  }

  // ── Clear all data ───────────────────────────────────────────
  function handleClearData() {
    // Remove all scoped journal keys
    const scope = user?.email ?? 'guest';
    localStorage.removeItem(`journal_entries:${scope}`);
    localStorage.removeItem(`journal_books:${scope}`);
    localStorage.removeItem(`journal_demo_seeded:${scope}`);
    refreshBooks();
    setShowClearConfirm(false);
    showToast('All journal data has been cleared.', 'success');
  }

  const glassBg: React.CSSProperties = {
    background: isDark ? 'rgba(17,17,19,0.85)' : 'rgba(236,236,238,0.85)',
  };

  const primaryBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
    boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
  };

  const dangerBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FF3B30 0%, #D70015 100%)',
    boxShadow: '0 2px 8px rgba(255,59,48,0.30), inset 0 1px 0 rgba(255,255,255,0.20)',
  };

  return (
    <div className="min-h-full" style={{ ...glassBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `0.5px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          background: isDark ? 'rgba(17,17,19,0.80)' : 'rgba(236,236,238,0.80)' }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center justify-center size-8 rounded-full transition-all hover:scale-105 active:scale-95"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}` }}>
          <ArrowLeft className="size-4" style={{ color: textPrimary }} />
        </button>
        <h1 className="text-lg font-semibold tracking-tight" style={{ color: textPrimary }}>Settings</h1>

        {/* Toast */}
        <div className="ml-auto">
          <AnimatePresence>
            {toast && <Toast message={toast.message} type={toast.type} />}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-6">

        {/* ── Profile ─────────────────────────────────────────── */}
        <Section icon={<User className="size-4" />} title="Profile" isDark={isDark}>

          {/* Avatar preview + color picker */}
          <div className="flex items-center gap-4">
            <Initials name={displayName || user?.name || '?'} color={avatarColor} />
            <div className="flex-1">
              <div className="text-xs font-medium mb-2" style={{ color: textSecondary }}>Avatar Colour</div>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map(c => (
                  <button key={c} onClick={() => setAvatarColor(c)}
                    className="size-7 rounded-full transition-all hover:scale-110"
                    style={{ background: c,
                      outline: avatarColor === c ? `2px solid ${c}` : 'none',
                      outlineOffset: 2,
                      transform: avatarColor === c ? 'scale(1.18)' : undefined }} />
                ))}
              </div>
            </div>
          </div>

          <Row label="Display Name" isDark={isDark}>
            <div style={{ width: 220 }}>
              <Input value={displayName} onChange={setDisplayName} placeholder="Your name" isDark={isDark} />
            </div>
          </Row>

          <Row label="Email Address" sublabel="Cannot be changed" isDark={isDark}>
            <span className="text-sm px-3 py-1.5 rounded-lg"
              style={{ color: textSecondary, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              {user?.email ?? '—'}
            </span>
          </Row>

          <button onClick={handleSaveProfile}
            className="self-start px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
            style={primaryBtn}>
            Save Profile
          </button>
        </Section>

        {/* ── Appearance ──────────────────────────────────────── */}
        <Section icon={<Palette className="size-4" />} title="Appearance" isDark={isDark}>
          <Row label="Dark Mode" sublabel="Switches between light and dark theme" isDark={isDark}>
            <Toggle value={isDark} onChange={() => toggleTheme()} />
          </Row>
          <Row label="Current Theme" isDark={isDark}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
              {isDark
                ? <><Moon className="size-3.5" style={{ color: '#5856D6' }} /><span className="text-xs font-medium" style={{ color: textSecondary }}>Dark</span></>
                : <><Sun  className="size-3.5" style={{ color: '#FF9500' }} /><span className="text-xs font-medium" style={{ color: textSecondary }}>Light</span></>}
            </div>
          </Row>
        </Section>

        {/* ── Security ────────────────────────────────────────── */}
        {user && (
          <Section icon={<Shield className="size-4" />} title="Security" isDark={isDark}>
            <Row label="Current Password" isDark={isDark} />
            <Input value={currentPass} onChange={setCurrentPass}
              type={showCurrent ? 'text' : 'password'} placeholder="Enter current password"
              isDark={isDark}
              right={
                <button onClick={() => setShowCurrent(v => !v)} style={{ color: textSecondary }}>
                  {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              } />

            <Row label="New Password" sublabel="Minimum 6 characters" isDark={isDark} />
            <Input value={newPass} onChange={setNewPass}
              type={showNew ? 'text' : 'password'} placeholder="New password"
              isDark={isDark}
              right={
                <button onClick={() => setShowNew(v => !v)} style={{ color: textSecondary }}>
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              } />

            <Input value={confirmPass} onChange={setConfirmPass}
              type="password" placeholder="Confirm new password" isDark={isDark} />

            <button onClick={handleChangePassword}
              className="self-start px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={primaryBtn}>
              Update Password
            </button>
          </Section>
        )}

        {/* ── Data & Privacy ──────────────────────────────────── */}
        <Section icon={<Database className="size-4" />} title="Data & Privacy" isDark={isDark}>
          <Row label="Your Data" sublabel={`${books.length} journals · ${storage.getEntries().length} entries`} isDark={isDark} />

          <Row label="Export Data" sublabel="Download all your journals and entries as JSON" isDark={isDark}>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={primaryBtn}>
              <Download className="size-3.5" />
              Export
            </button>
          </Row>

          <div style={{ height: '0.5px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }} />

          <Row label="Clear All Data" sublabel="Permanently deletes all journals and entries. Cannot be undone." isDark={isDark}>
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
                style={dangerBtn}>
                <Trash2 className="size-3.5" />
                Clear
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: '#FF3B30' }}>Are you sure?</span>
                <button onClick={handleClearData}
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all hover:brightness-110"
                  style={dangerBtn}>
                  Yes, delete
                </button>
                <button onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{ color: textSecondary, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}>
                  Cancel
                </button>
              </div>
            )}
          </Row>
        </Section>

        {/* ── About ───────────────────────────────────────────── */}
        <Section icon={<Info className="size-4" />} title="About" isDark={isDark}>
          <Row label="App Name" isDark={isDark}>
            <span className="text-sm font-medium" style={{ color: textSecondary }}>Web Journal</span>
          </Row>
          <Row label="Version" isDark={isDark}>
            <span className="text-sm font-medium" style={{ color: textSecondary }}>1.0.0</span>
          </Row>
          <Row label="Stack" isDark={isDark}>
            <span className="text-xs px-2.5 py-1 rounded-lg" style={{ color: textSecondary, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
              React 18 · TypeScript · Vite · Tailwind v4
            </span>
          </Row>
          <Row label="Design" isDark={isDark}>
            <span className="text-sm" style={{ color: textSecondary }}>macOS 26 Tahoe · Liquid Glass</span>
          </Row>
          <Row label="Storage" sublabel="All data is stored locally in your browser" isDark={isDark} />
        </Section>

        {/* ── Sign out ────────────────────────────────────────── */}
        {user && (
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-2xl transition-all hover:brightness-110 active:scale-98 mb-6"
            style={{ ...dangerBtn, color: '#fff' }}>
            <LogOut className="size-4" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
