import { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { ProfileMenu } from './ProfileMenu';
import { Home } from '../pages/Home';
import { BookProvider } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';

const SIDEBAR_MIN = 200;
const SIDEBAR_MAX = 480;
const SIDEBAR_DEFAULT = 272;

// Smooth iOS-style easing
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const DURATION = 0.34;

function LayoutContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar_width');
    return saved ? Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, parseInt(saved))) : SIDEBAR_DEFAULT;
  });
  const isResizing   = useRef(false);
  const resizeStartX = useRef(0);
  const resizeStartW = useRef(0);
  const { theme } = useTheme();
  const location  = useLocation();
  const isDark    = theme === 'dark';

  // ── Resize mouse handlers ──────────────────────────────────────
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    if (isSidebarCollapsed) return;
    isResizing.current  = true;
    resizeStartX.current = e.clientX;
    resizeStartW.current = sidebarWidth;
    e.preventDefault();
  }, [isSidebarCollapsed, sidebarWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const next = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, resizeStartW.current + e.clientX - resizeStartX.current));
      setSidebarWidth(next);
      localStorage.setItem('sidebar_width', String(next));
      // Keep cursor col-resize during drag
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Any child route means the detail panel should be visible
  const isDetail = location.pathname !== '/';

  // Shared spring config — both panels get identical timing so they
  // move as one coordinated unit
  const panelTransition = { duration: DURATION, ease: EASE };

  // ── Tahoe tokens ─────────────────────────────────────────────
  const windowBg      = isDark ? '#111113'                    : '#dddde0';
  const sidebarBg     = isDark ? 'rgba(30,30,34,0.72)'       : 'rgba(255,255,255,0.55)';
  const sidebarBorder = isDark ? 'rgba(255,255,255,0.11)'    : 'rgba(255,255,255,0.75)';
  const sidebarShadow = isDark
    ? '0 20px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)'
    : '0 20px 48px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)';
  // Toggle button — always clearly visible against the sidebar
  const toggleBg      = isDark ? '#2c2c2e'                   : '#ffffff';
  const toggleBorder  = isDark ? 'rgba(255,255,255,0.22)'    : 'rgba(0,0,0,0.14)';
  const toggleShadow  = isDark
    ? '0 0 0 1px rgba(255,255,255,0.10), 0 4px 14px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)'
    : '0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,1)';
  const toggleIcon    = isDark ? '#ffffff'                   : '#1c1c1e';

  return (
    <BookProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: windowBg }}>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        {/* Outer shell — handles width + floating gap */}
        <div
          className="relative z-10 flex-shrink-0 flex flex-col p-3"
          style={{
            width: isSidebarCollapsed ? 88 : sidebarWidth,
            // Only animate when toggling collapsed — not while dragging
            transition: isResizing.current ? 'none' : 'width 0.3s ease-out',
          }}
        >
          {/* Floating glass panel */}
          <div
            className="relative flex-1 overflow-hidden"
            style={{
              borderRadius:           '18px',
              backdropFilter:         'blur(60px) saturate(220%)',
              WebkitBackdropFilter:   'blur(60px) saturate(220%)',
              background:             sidebarBg,
              border:                 `0.5px solid ${sidebarBorder}`,
              boxShadow:              sidebarShadow,
            }}
          >
            <Sidebar isCollapsed={isSidebarCollapsed} />

            <button
              onClick={() => setIsSidebarCollapsed(v => !v)}
              className={`absolute z-50 flex items-center justify-center size-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${isSidebarCollapsed ? 'left-1/2 -translate-x-1/2 top-5' : 'right-3 top-5'}`}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                backdropFilter:       'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background:           toggleBg,
                border:               `0.5px solid ${toggleBorder}`,
                boxShadow:            toggleShadow,
              }}
            >
              {isSidebarCollapsed
                ? <ChevronRight className="size-4" style={{ color: toggleIcon }} />
                : <ChevronLeft  className="size-4" style={{ color: toggleIcon }} />
              }
            </button>
          </div>

          {/* Resize handle — sits in the right padding gap */}
          {!isSidebarCollapsed && (
            <div
              onMouseDown={onResizeStart}
              style={{
                position:   'absolute',
                top:        12,
                bottom:     12,
                right:      0,
                width:      8,
                cursor:     'col-resize',
                zIndex:     30,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Subtle visible grip line */}
              <div style={{
                width:        2,
                height:       '100%',
                borderRadius: 2,
                background:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                transition:   'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  isDark ? 'rgba(10,132,255,0.55)' : 'rgba(0,122,255,0.40)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
              }}
              />
            </div>
          )}
        </div>

        {/* ── Main ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* Top bar — floating glass pill */}
          <div className="flex-shrink-0 px-3 pt-3 z-20">
            <div
              className="flex justify-end px-5 py-2.5"
              style={{
                borderRadius:         '14px',
                backdropFilter:       'blur(60px) saturate(220%)',
                WebkitBackdropFilter: 'blur(60px) saturate(220%)',
                background:           sidebarBg,
                border:               `0.5px solid ${sidebarBorder}`,
                boxShadow:            sidebarShadow,
              }}
            >
              <ProfileMenu />
            </div>
          </div>

          {/*
           * Master-detail panel container
           * Both panels are absolute siblings filling the same box.
           * When isDetail flips, both animate at the same instant with
           * identical duration + easing — perfectly coordinated.
           *
           *  ┌─────────────────────────────────────┐
           *  │  [List -100% ←]   [Detail 0%        │  ← detail open
           *  │  [List   0%  ]    [Detail → +100%]  │  ← list showing
           *  └─────────────────────────────────────┘
           */}
          <div className="flex-1 relative overflow-hidden">

            {/* List panel — always mounted, stays warm */}
            <motion.div
              animate={{ x: isDetail ? '-100%' : '0%' }}
              transition={panelTransition}
              style={{
                position:   'absolute',
                inset:      0,
                overflowY:  'auto',
                overflowX:  'hidden',
                willChange: 'transform',
              }}
            >
              <Home />
            </motion.div>

            {/* Detail panel — always mounted, off-screen right when list is active */}
            <motion.div
              animate={{ x: isDetail ? '0%' : '100%' }}
              transition={panelTransition}
              style={{
                position:   'absolute',
                inset:      0,
                overflowY:  'auto',
                overflowX:  'hidden',
                willChange: 'transform',
              }}
            >
              <Outlet />
            </motion.div>

          </div>
        </div>
      </div>
    </BookProvider>
  );
}

export function Layout() {
  return <LayoutContent />;
}
