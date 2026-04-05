import { User, Settings, LogIn, Moon, Sun } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center size-9 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          background: theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.7)',
          border: theme === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.15)' 
            : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: theme === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
        aria-label="Profile menu"
      >
        <User className="size-4" style={{ color: theme === 'dark' ? '#f5f5f7' : '#1d1d1f' }} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            background: theme === 'dark' 
              ? 'rgba(30, 30, 30, 0.85)' 
              : 'rgba(255, 255, 255, 0.85)',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.15)' 
              : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: theme === 'dark'
              ? '0 20px 40px rgba(0, 0, 0, 0.6)'
              : '0 20px 40px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle login
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: theme === 'dark' ? '#f5f5f7' : '#1d1d1f',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogIn className="size-4" />
              <span>Login</span>
            </button>

            <div 
              className="my-1 mx-2" 
              style={{
                height: '1px',
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.06)'
              }}
            />

            <button
              onClick={() => {
                setIsOpen(false);
                // Handle settings
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: theme === 'dark' ? '#f5f5f7' : '#1d1d1f',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </button>

            <div 
              className="my-1 mx-2" 
              style={{
                height: '1px',
                background: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.06)'
              }}
            />

            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: theme === 'dark' ? '#f5f5f7' : '#1d1d1f',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
                <span>Appearance</span>
              </div>
              <span className="text-xs" style={{ color: '#86868b' }}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
