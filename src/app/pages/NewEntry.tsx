import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Smile, Frown, Meh, Sparkles, CloudRain } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { saveEntry } from '../utils/storage';
import { JournalEntry } from '../types';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';

const moods = [
  { value: 'happy',   label: 'Happy',   icon: Smile },
  { value: 'excited', label: 'Excited', icon: Sparkles },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'anxious', label: 'Anxious', icon: CloudRain },
  { value: 'sad',     label: 'Sad',     icon: Frown },
];

export function NewEntry() {
  const navigate       = useNavigate();
  const { selectedBook } = useBook();
  const { theme }      = useTheme();
  const isDark         = theme === 'dark';

  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood]       = useState<string>('');
  const [tags, setTags]       = useState('');

  // ── Tahoe design tokens ──────────────────────────────────────────
  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';

  const glassSurface: React.CSSProperties = {
    backdropFilter: 'blur(60px) saturate(220%)',
    WebkitBackdropFilter: 'blur(60px) saturate(220%)',
    background: isDark ? 'rgba(30,30,34,0.72)' : 'rgba(255,255,255,0.72)',
    border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'}`,
    boxShadow: isDark
      ? '0 20px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)'
      : '0 20px 48px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',
    borderRadius: '18px',
  };

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
    color: textPrimary,
    borderRadius: '10px',
  };

  const ghostBtn: React.CSSProperties = {
    color: textSecondary,
    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
  };

  const primaryBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
    boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !selectedBook) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      bookId: selectedBook.id,
      mood: mood as JournalEntry['mood'],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    saveEntry(entry);
    navigate('/');
  };

  if (!selectedBook) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div style={{ ...glassSurface, padding: '3rem' }} className="text-center max-w-md">
          <p style={{ color: textSecondary }}>Please select a journal from the sidebar first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            style={ghostBtn}
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
            style={primaryBtn}
          >
            Save Entry
          </button>
        </header>

        {/* Glass form card */}
        <div style={glassSurface} className="p-8">
          <h1 className="text-2xl font-bold mb-8" style={{ color: textPrimary }}>
            New Journal Entry
          </h1>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium" style={{ color: textPrimary }}>
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter entry title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
                style={inputStyle}
              />
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: textPrimary }}>
                Mood
              </Label>
              <div className="flex gap-2 flex-wrap">
                {moods.map(({ value, label, icon: Icon }) => {
                  const isSelected = mood === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setMood(value)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)'
                          : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        color: isSelected ? '#fff' : textPrimary,
                        boxShadow: isSelected
                          ? '0 2px 8px rgba(0,122,255,0.30), inset 0 1px 0 rgba(255,255,255,0.25)'
                          : 'none',
                      }}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium" style={{ color: textPrimary }}>
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-80 resize-none text-base leading-relaxed"
                style={inputStyle}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium" style={{ color: textPrimary }}>
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="e.g., work, personal, ideas…"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="text-base"
                style={inputStyle}
              />
              <p className="text-xs" style={{ color: textSecondary }}>Separate tags with commas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
