import { User, LogIn, LogOut, Moon, Sun, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Initials({ name, color }: { name: string; color: string }) {
  const parts  = name.trim().split(' ');
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2);
  return (
    <span
      className="size-9 rounded-full flex items-center justify-center text-sm font-semibold text-white select-none"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 2px 8px ${color}55`,
      }}
    >
      {initials.toUpperCase()}
    </span>
  );
}

export function ProfileMenu() {
  const [isOpen, setIsOpen]   = useState(false);
  const menuRef               = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout }      = useAuth();
  const navigate              = useNavigate();
  const isDark                = theme === 'dark';

  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';
  const hoverBg       = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const divider       = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const menuBg        = isDark ? 'rgba(28,28,32,0.88)' : 'rgba(255,255,255,0.88)';
  const menuBorder    = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const menuShadow    = isDark
    ? '0 20px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 20px 48px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9)';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const avatarBtnStyle: React.CSSProperties = {
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.70)',
    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.06)',
    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
  };

  function MenuItem({
    icon,
    label,
    sublabel,
    onClick,
    danger,
  }: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    onClick: () => void;
    danger?: boolean;
  }) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-lg"
        style={{ color: danger ? '#FF3B30' : textPrimary, background: 'transparent' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = danger
            ? (isDark ? 'rgba(255,59,48,0.12)' : 'rgba(255,59,48,0.07)')
            : hoverBg;
        }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {sublabel && <span className="text-xs" style={{ color: textSecondary }}>{sublabel}</span>}
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar / icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center size-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
        style={user ? {} : avatarBtnStyle}
        aria-label="Profile menu"
      >
        {user ? (
          <Initials name={user.name} color={user.avatarColor} />
        ) : (
          <User className="size-4" style={{ color: isDark ? '#f5f5f7' : '#1d1d1f' }} />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 w-60 rounded-2xl overflow-hidden z-50"
          style={{
            backdropFilter: 'blur(60px) saturate(220%)',
            WebkitBackdropFilter: 'blur(60px) saturate(220%)',
            background: menuBg,
            border: `0.5px solid ${menuBorder}`,
            boxShadow: menuShadow,
          }}
        >
          {/* User info header — only when logged in */}
          {user && (
            <>
              <div className="flex items-center gap-3 px-4 py-4">
                <Initials name={user.name} color={user.avatarColor} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                    {user.name}
                  </div>
                  <div className="text-xs truncate mt-0.5" style={{ color: textSecondary }}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mx-3 h-px" style={{ background: divider }} />
            </>
          )}

          {/* Menu items */}
          <div className="p-2">
            {!user ? (
              <MenuItem
                icon={<LogIn className="size-4" />}
                label="Sign In"
                onClick={() => { setIsOpen(false); navigate('/login'); }}
              />
            ) : (
              <MenuItem
                icon={<Settings className="size-4" />}
                label="Settings"
                onClick={() => { setIsOpen(false); navigate('/settings'); }}
              />
            )}

            <div className="my-1 h-px mx-1" style={{ background: divider }} />

            {/* Appearance */}
            <MenuItem
              icon={isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
              label="Appearance"
              sublabel={isDark ? 'Dark' : 'Light'}
              onClick={() => { toggleTheme(); }}
            />

            {/* Sign out — only when logged in */}
            {user && (
              <>
                <div className="my-1 h-px mx-1" style={{ background: divider }} />
                <MenuItem
                  icon={<LogOut className="size-4" />}
                  label="Sign Out"
                  onClick={() => { setIsOpen(false); logout(); navigate('/login'); }}
                  danger
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
