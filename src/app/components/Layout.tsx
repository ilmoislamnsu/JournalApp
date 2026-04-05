import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { ProfileMenu } from './ProfileMenu';
import { Home } from '../pages/Home';
import { BookProvider } from '../context/BookContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Smooth iOS-style easing
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const DURATION = 0.34;

function LayoutContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const location  = useLocation();
  const isDark    = theme === 'dark';

  // Any child route means the detail panel should be visible
  const isDetail = location.pathname !== '/';

  // Shared spring config — both panels get identical timing so they
  // move as one coordinated unit
  const panelTransition = { duration: DURATION, ease: EASE };

  // ── Tahoe tokens ─────────────────────────────────────────────
  const windowBg      = isDark ? '#111113'                    : '#ececee';
  const sidebarBg     = isDark ? 'rgba(26,26,30,0.78)'       : 'rgba(246,246,248,0.82)';
  const sidebarBorder = isDark ? 'rgba(255,255,255,0.08)'    : 'rgba(0,0,0,0.07)';
  const sidebarShadow = isDark
    ? '0 0 0 0.5px rgba(255,255,255,0.06), 1px 0 0 rgba(0,0,0,0.35)'
    : '0 0 0 0.5px rgba(0,0,0,0.07), 1px 0 0 rgba(0,0,0,0.04)';
  const toggleBg      = isDark ? 'rgba(58,58,62,0.9)'        : 'rgba(255,255,255,0.88)';
  const toggleBorder  = isDark ? 'rgba(255,255,255,0.12)'    : 'rgba(0,0,0,0.08)';
  const toggleShadow  = isDark
    ? '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)';
  const toggleIcon    = isDark ? '#f2f2f7'                   : '#1c1c1e';
  const topBarBg      = isDark ? 'rgba(17,17,19,0.85)'      : 'rgba(236,236,238,0.85)';
  const topBarBorder  = isDark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.05)';

  return (
    <BookProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: windowBg }}>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <div
          className={`relative z-10 flex-shrink-0 transition-all duration-300 ease-out ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
          style={{
            backdropFilter:         'blur(48px) saturate(200%)',
            WebkitBackdropFilter:   'blur(48px) saturate(200%)',
            background:             sidebarBg,
            borderRight:            `0.5px solid ${sidebarBorder}`,
            boxShadow:              sidebarShadow,
          }}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />

          <button
            onClick={() => setIsSidebarCollapsed(v => !v)}
            className="absolute -right-3.5 top-6 z-50 flex items-center justify-center size-7 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
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
              ? <ChevronRight className="size-3.5" style={{ color: toggleIcon }} />
              : <ChevronLeft  className="size-3.5" style={{ color: toggleIcon }} />
            }
          </button>
        </div>

        {/* ── Main ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* Top bar */}
          <div
            className="z-20 flex-shrink-0 flex justify-end px-8 py-3"
            style={{
              backdropFilter:       'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              background:           topBarBg,
              borderBottom:         `0.5px solid ${topBarBorder}`,
            }}
          >
            <ProfileMenu />
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
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}
