import { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
} from './ui/alert-dialog';
import { useBook } from '../context/BookContext';
import { useTheme } from '../context/ThemeContext';
import { Book } from '../types';
import { saveBook, deleteBook, getEntriesByBook } from '../utils/storage';

const colorOptions = [
  '#007AFF', // blue
  '#AF52DE', // purple
  '#34C759', // green
  '#FF9500', // orange
  '#FF3B30', // red
  '#FF2D55', // pink
  '#5856D6', // indigo
  '#00C7BE', // teal
];

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const { selectedBook, setSelectedBook, books, refreshBooks } = useBook();
  const { theme } = useTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBookName, setNewBookName] = useState('');
  const [newBookColor, setNewBookColor] = useState(colorOptions[0]);
  const [editBookName, setEditBookName] = useState('');
  const [editBookColor, setEditBookColor] = useState(colorOptions[0]);

  const isDark = theme === 'dark';

  // ── macOS 26 Tahoe design tokens ─────────────────────────────────
  const textPrimary    = isDark ? '#f2f2f7' : '#1c1c1e';
  const textSecondary  = isDark ? '#aeaeb2' : '#6c6c70';
  const itemHoverBg    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const itemSelectedBg = isDark ? 'rgba(10,132,255,0.22)'  : 'rgba(0,122,255,0.12)';
  const itemSelectedTx = isDark ? '#409cff' : '#007AFF';
  const headerBorder   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  // Tahoe liquid-glass modal surface
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

  // Tahoe primary action button
  const primaryBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
    boxShadow: '0 2px 8px rgba(0,122,255,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
  };

  const handleAddBook = () => {
    if (!newBookName.trim()) return;
    const newBook: Book = {
      id: Date.now().toString(),
      name: newBookName.trim(),
      color: newBookColor,
    };
    saveBook(newBook);
    refreshBooks();
    setNewBookName('');
    setNewBookColor(colorOptions[0]);
    setIsAddDialogOpen(false);
    setSelectedBook(newBook);
  };

  const handleEditBook = () => {
    if (!editingBook || !editBookName.trim()) return;
    const updatedBook: Book = {
      ...editingBook,
      name: editBookName.trim(),
      color: editBookColor,
    };
    saveBook(updatedBook);
    refreshBooks();
    if (selectedBook?.id === editingBook.id) setSelectedBook(updatedBook);
    setIsEditDialogOpen(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (book: Book) => {
    deleteBook(book.id);
    refreshBooks();
    if (selectedBook?.id === book.id) {
      const remaining = books.filter((b) => b.id !== book.id);
      setSelectedBook(remaining[0] || null);
    }
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setEditBookName(book.name);
    setEditBookColor(book.color);
    setIsEditDialogOpen(true);
  };

  // Shared input style
  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
    color: textPrimary,
    borderRadius: '10px',
  };

  // Color-picker component
  const ColorPicker = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (c: string) => void;
  }) => (
    <div className="flex gap-2 flex-wrap">
      {colorOptions.map((color) => (
        <button
          key={color}
          className="size-9 rounded-full transition-all hover:scale-105"
          style={{
            backgroundColor: color,
            transform: value === color ? 'scale(1.12)' : undefined,
            outline: value === color ? `2px solid ${color}` : 'none',
            outlineOffset: '2px',
          }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );

  // Reusable dialog form body
  const JournalForm = ({
    nameId,
    nameValue,
    onNameChange,
    onKeyDown,
    colorValue,
    onColorChange,
  }: {
    nameId: string;
    nameValue: string;
    onNameChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    colorValue: string;
    onColorChange: (c: string) => void;
  }) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor={nameId} className="text-sm font-medium" style={{ color: textPrimary }}>
          Journal Name
        </Label>
        <Input
          id={nameId}
          placeholder="e.g., Life, School, Work…"
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={onKeyDown}
          style={inputStyle}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium" style={{ color: textPrimary }}>
          Color
        </Label>
        <ColorPicker value={colorValue} onChange={onColorChange} />
      </div>
    </div>
  );

  return (
    <aside className="h-full flex flex-col">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        className={`px-4 ${isCollapsed ? 'py-3' : 'py-5'}`}
        style={{
          borderBottom: `0.5px solid ${headerBorder}`,
          minHeight: isCollapsed ? '64px' : undefined,
        }}
      >
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="size-5" style={{ color: textSecondary }} />
              <h2 className="text-sm font-semibold tracking-tight" style={{ color: textPrimary }}>
                Journals
              </h2>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-xl transition-all hover:brightness-110 active:scale-95"
                  style={primaryBtn}
                >
                  <Plus className="size-4" />
                  New Journal
                </button>
              </DialogTrigger>
              <DialogContent style={dialogSurface}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold" style={{ color: textPrimary }}>
                    Create New Journal
                  </DialogTitle>
                  <DialogDescription style={{ color: textSecondary }}>
                    Add a new journal to organize your entries.
                  </DialogDescription>
                </DialogHeader>
                <JournalForm
                  nameId="book-name"
                  nameValue={newBookName}
                  onNameChange={setNewBookName}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBook()}
                  colorValue={newBookColor}
                  onColorChange={setNewBookColor}
                />
                <DialogFooter>
                  <button
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                    style={{
                      color: textSecondary,
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBook}
                    disabled={!newBookName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-40"
                    style={primaryBtn}
                  >
                    Create Journal
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : null}
      </div>

      {/* ── Books List ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="space-y-0.5 px-2">
          {books.map((book) => {
            const entryCount = getEntriesByBook(book.id).length;
            const isSelected = selectedBook?.id === book.id;

            return (
              <div
                key={book.id}
                className="group relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150"
                style={{ background: isSelected ? itemSelectedBg : 'transparent' }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.background = itemHoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
                onClick={() => setSelectedBook(book)}
              >
                {!isCollapsed ? (
                  <>
                    <div
                      className="size-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: book.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: isSelected ? itemSelectedTx : textPrimary }}
                      >
                        {book.name}
                      </div>
                      <div className="text-xs" style={{ color: textSecondary }}>
                        {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                      </div>
                    </div>

                    {/* Action buttons — appear on hover */}
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Edit */}
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditDialog(book); }}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: textSecondary }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background = itemHoverBg)
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
                        }
                        title="Edit"
                      >
                        <Edit2 className="size-3.5" />
                      </button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg transition-colors"
                            style={{ color: '#FF3B30' }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLButtonElement).style.background =
                                isDark ? 'rgba(255,59,48,0.15)' : 'rgba(255,59,48,0.08)')
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
                            }
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent style={dialogSurface}>
                          <AlertDialogHeader>
                            <AlertDialogTitle
                              className="text-xl font-semibold"
                              style={{ color: textPrimary }}
                            >
                              Delete "{book.name}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription style={{ color: textSecondary }}>
                              This will permanently delete this journal and all of its entries.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="px-4 py-2 text-sm font-medium rounded-xl"
                              style={{
                                color: textSecondary,
                                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                                border: 'none',
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBook(book)}
                              className="px-4 py-2 text-sm font-medium text-white rounded-xl"
                              style={{
                                background: 'linear-gradient(135deg, #FF3B30 0%, #D70015 100%)',
                                boxShadow: '0 2px 8px rgba(255,59,48,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                                border: 'none',
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                ) : (
                  /* Collapsed: colored dot only */
                  <div
                    className="size-6 rounded-full mx-auto"
                    style={{ backgroundColor: book.color }}
                    title={`${book.name} — ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Edit Dialog ───────────────────────────────────────────── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent style={dialogSurface}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold" style={{ color: textPrimary }}>
              Edit Journal
            </DialogTitle>
            <DialogDescription style={{ color: textSecondary }}>
              Update your journal's name and color.
            </DialogDescription>
          </DialogHeader>
          <JournalForm
            nameId="edit-book-name"
            nameValue={editBookName}
            onNameChange={setEditBookName}
            onKeyDown={(e) => e.key === 'Enter' && handleEditBook()}
            colorValue={editBookColor}
            onColorChange={setEditBookColor}
          />
          <DialogFooter>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
              style={{
                color: textSecondary,
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleEditBook}
              disabled={!editBookName.trim()}
              className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-40"
              style={primaryBtn}
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
