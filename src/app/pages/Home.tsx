import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Calendar, Smile, Frown, Meh, Sparkles, CloudRain } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { getEntriesByBook } from '../utils/storage';
import { JournalEntry } from '../types';
import { format } from 'date-fns';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';

const moodIcons = {
  happy:   Smile,
  sad:     Frown,
  neutral: Meh,
  excited: Sparkles,
  anxious: CloudRain,
};

const moodColors = {
  happy:   '#34C759',
  excited: '#FF9500',
  neutral: '#8e8e93',
  anxious: '#FF3B30',
  sad:     '#5856D6',
};

// ── Entry card ────────────────────────────────────────────────────
function EntryCard({
  entry,
  isDark,
  index,
}: {
  entry: JournalEntry;
  isDark: boolean;
  index: number;
}) {
  const navigate  = useNavigate();
  const cardRef   = useRef<HTMLDivElement>(null);

  // Spring-physics glow tracking — watery feel
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const glowX = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.6 });
  const glowY = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.6 });

  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';
  const MoodIcon      = entry.mood ? moodIcons[entry.mood as keyof typeof moodIcons] : null;
  const moodColor     = entry.mood ? moodColors[entry.mood as keyof typeof moodColors] : textSecondary;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  return (
    // Stagger cards in when the list panel mounts / book changes
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.055, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onClick={() => navigate(`/entry/${entry.id}`)}
        whileHover={{
          y: -2,
          boxShadow: isDark
            ? '0 12px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)'
            : '0 12px 36px rgba(0,0,0,0.11), inset 0 1px 0 rgba(255,255,255,1)',
        }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position:             'relative',
          overflow:             'hidden',
          borderRadius:         '18px',
          padding:              '20px 22px',
          cursor:               'pointer',
          backdropFilter:       'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          background: isDark ? 'rgba(30,30,34,0.70)' : 'rgba(255,255,255,0.72)',
          border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}`,
          boxShadow: isDark
            ? '0 2px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.07)'
            : '0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
          willChange: 'transform',
        }}
      >
        {/* Fluid spring glow that follows the cursor */}
        <motion.div
          style={{
            position:      'absolute',
            width:          200,
            height:         200,
            borderRadius:  '50%',
            pointerEvents: 'none',
            x:             glowX,
            y:             glowY,
            translateX:    '-50%',
            translateY:    '-50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.055) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(255,255,255,0.60) 0%, transparent 68%)',
            zIndex: 0,
          }}
        />

        {/* Card content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-semibold leading-snug" style={{ color: textPrimary }}>
              {entry.title}
            </h3>
            {MoodIcon && (
              <span
                className="flex-shrink-0 mt-0.5 p-1.5 rounded-full"
                style={{ color: moodColor, background: `${moodColor}1a` }}
              >
                <MoodIcon className="size-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: textSecondary }}>
            <Calendar className="size-3" />
            {format(new Date(entry.date), 'MMM d, yyyy')}
          </div>

          <p
            className="text-sm leading-relaxed line-clamp-2 mb-3"
            style={{ color: isDark ? '#98989d' : '#6c6c70' }}
          >
            {entry.content}
          </p>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {entry.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.055)',
                    color: textSecondary,
                  }}
                >
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    color: textSecondary,
                  }}
                >
                  +{entry.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export function Home() {
  const { selectedBook }       = useBook();
  const { theme }              = useTheme();
  const isDark                 = theme === 'dark';
  const [entries, setEntries]  = useState<JournalEntry[]>([]);

  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';

  const glassSurface: React.CSSProperties = {
    backdropFilter:       'blur(48px) saturate(200%)',
    WebkitBackdropFilter: 'blur(48px) saturate(200%)',
    background: isDark ? 'rgba(30,30,34,0.72)' : 'rgba(255,255,255,0.72)',
    border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: isDark
      ? '0 20px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)'
      : '0 20px 48px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.95)',
    borderRadius: '18px',
  };

  useEffect(() => {
    if (selectedBook) setEntries(getEntriesByBook(selectedBook.id));
  }, [selectedBook]);

  if (!selectedBook) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div style={{ ...glassSurface, padding: '3rem' }} className="text-center max-w-md">
          <div
            className="size-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
          >
            <Calendar className="size-10" style={{ color: textSecondary }} />
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: textPrimary }}>
            No Journal Selected
          </h2>
          <p style={{ color: textSecondary }}>
            Select or create a journal from the sidebar to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full" style={{ backgroundColor: selectedBook.color }} />
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: textPrimary }}>
              {selectedBook.name}
            </h1>
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full ml-1"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                color: textSecondary,
              }}
            >
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <Link to="/new" className="flex-shrink-0">
            {/* Full button — visible when there's enough room */}
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              <Plus className="size-4" />
              New Entry
            </button>
            {/* Compact icon-only button — shown when space is tight */}
            <button
              className="sm:hidden flex items-center justify-center size-9 text-white rounded-full transition-all hover:brightness-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
              aria-label="New Entry"
            >
              <Plus className="size-5" />
            </button>
          </Link>
        </header>

        {/* Entries */}
        {entries.length === 0 ? (
          <div style={{ ...glassSurface, padding: '5rem 2rem' }} className="text-center">
            <div
              className="size-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
            >
              <Calendar className="size-8" style={{ color: textSecondary }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: textPrimary }}>
              No Entries Yet
            </h2>
            <p className="mb-6" style={{ color: textSecondary }}>
              Start your journaling journey by creating your first entry.
            </p>
            <Link to="/new">
              <button
                className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                  boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                Create First Entry
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} isDark={isDark} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
