import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Edit2, Trash2, Calendar, Smile, Frown, Meh, Sparkles, CloudRain } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { getEntryById, saveEntry, deleteEntry } from '../utils/storage';
import { JournalEntry } from '../types';
import { format } from 'date-fns';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';

const moods = [
  { value: 'happy',   label: 'Happy',   icon: Smile },
  { value: 'excited', label: 'Excited', icon: Sparkles },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'anxious', label: 'Anxious', icon: CloudRain },
  { value: 'sad',     label: 'Sad',     icon: Frown },
];

const moodIcons = {
  happy: Smile, sad: Frown, neutral: Meh, excited: Sparkles, anxious: CloudRain,
};

export function EntryDetail() {
  const { id }        = useParams<{ id: string }>();
  const navigate      = useNavigate();
  const { refreshBooks } = useBook();
  const { theme }     = useTheme();
  const isDark        = theme === 'dark';

  const [entry, setEntry]             = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing]     = useState(false);
  const [editTitle, setEditTitle]     = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood]       = useState<string>('');
  const [editTags, setEditTags]       = useState('');

  // ── Tahoe design tokens ──────────────────────────────────────────
  const textPrimary   = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary = isDark ? '#aeaeb2' : '#6c6c70';
  const divider       = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

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

  const dialogSurface: React.CSSProperties = {
    backdropFilter: 'blur(60px) saturate(220%)',
    WebkitBackdropFilter: 'blur(60px) saturate(220%)',
    background: isDark ? 'rgba(36,36,40,0.92)' : 'rgba(255,255,255,0.92)',
    border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)'}`,
    boxShadow: isDark
      ? '0 28px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 28px 56px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
    borderRadius: '14px',
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

  const dangerBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FF3B30 0%, #D70015 100%)',
    boxShadow: '0 2px 8px rgba(255,59,48,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
  };

  useEffect(() => {
    if (id) {
      const foundEntry = getEntryById(id);
      if (foundEntry) {
        setEntry(foundEntry);
        setEditTitle(foundEntry.title);
        setEditContent(foundEntry.content);
        setEditMood(foundEntry.mood || '');
        setEditTags(foundEntry.tags?.join(', ') || '');
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (!entry || !editTitle.trim() || !editContent.trim()) return;
    const updated: JournalEntry = {
      ...entry,
      title: editTitle.trim(),
      content: editContent.trim(),
      mood: editMood as JournalEntry['mood'],
      tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    saveEntry(updated);
    setEntry(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (entry) { deleteEntry(entry.id); refreshBooks(); navigate('/'); }
  };

  const getMoodIcon = (mood?: string) => {
    if (!mood) return null;
    const Icon = moodIcons[mood as keyof typeof moodIcons];
    return Icon ? <Icon className="size-5" /> : null;
  };

  if (!entry) return null;

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

          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                style={ghostBtn}
              >
                <Edit2 className="size-4" />
                Edit
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
                    style={dangerBtn}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent style={dialogSurface}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold" style={{ color: textPrimary }}>
                      Delete this entry?
                    </AlertDialogTitle>
                    <AlertDialogDescription style={{ color: textSecondary }}>
                      This action cannot be undone. Your journal entry will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="px-4 py-2 text-sm font-medium rounded-xl"
                      style={{ ...ghostBtn, border: 'none' }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-white rounded-xl"
                      style={{ ...dangerBtn, border: 'none' }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(entry.title);
                  setEditContent(entry.content);
                  setEditMood(entry.mood || '');
                  setEditTags(entry.tags?.join(', ') || '');
                }}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                style={ghostBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editTitle.trim() || !editContent.trim()}
                className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
                style={primaryBtn}
              >
                Save
              </button>
            </div>
          )}
        </header>

        {/* Glass card */}
        <div style={glassSurface} className="p-8">
          {!isEditing ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold flex-1" style={{ color: textPrimary }}>
                  {entry.title}
                </h1>
                {entry.mood && (
                  <span className="mt-1" style={{ color: textSecondary }}>
                    {getMoodIcon(entry.mood)}
                  </span>
                )}
              </div>

              <div
                className="flex items-center gap-2 text-sm mb-8 pb-6"
                style={{ color: textSecondary, borderBottom: `0.5px solid ${divider}` }}
              >
                <Calendar className="size-4" />
                {format(new Date(entry.date), 'EEEE, MMMM d, yyyy • h:mm a')}
              </div>

              <p className="whitespace-pre-wrap leading-relaxed mb-8" style={{ color: textPrimary }}>
                {entry.content}
              </p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-6" style={{ borderTop: `0.5px solid ${divider}` }}>
                  {entry.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm font-medium rounded-lg"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
                        color: textSecondary,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium" style={{ color: textPrimary }}>Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={inputStyle} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: textPrimary }}>Mood</Label>
                <div className="flex gap-2 flex-wrap">
                  {moods.map(({ value, label, icon: Icon }) => {
                    const sel = editMood === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setEditMood(value)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all"
                        style={{
                          background: sel
                            ? 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)'
                            : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                          color: sel ? '#fff' : textPrimary,
                          boxShadow: sel ? '0 2px 8px rgba(0,122,255,0.30)' : 'none',
                        }}
                      >
                        <Icon className="size-4" />{label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-sm font-medium" style={{ color: textPrimary }}>Content</Label>
                <Textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-80 resize-none text-base leading-relaxed"
                  style={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags" className="text-sm font-medium" style={{ color: textPrimary }}>Tags</Label>
                <Input id="edit-tags" value={editTags} onChange={(e) => setEditTags(e.target.value)} style={inputStyle} />
                <p className="text-xs" style={{ color: textSecondary }}>Separate tags with commas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
