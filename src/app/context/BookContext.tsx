import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { useAuth } from './AuthContext';
import { getBooks } from '../utils/storage';

interface BookContextType {
  selectedBook: Book | null;
  setSelectedBook: (book: Book) => void;
  books: Book[];
  refreshBooks: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const scope = user?.email ?? 'guest';

  const [books, setBooks]               = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const refreshBooks = () => {
    const loaded = getBooks(scope);
    setBooks(loaded);
    // Always reset selection to first book when refreshing
    setSelectedBook((prev) => {
      if (prev && loaded.find((b) => b.id === prev.id)) return prev;
      return loaded[0] ?? null;
    });
  };

  // Re-load books whenever the logged-in user changes
  useEffect(() => {
    setBooks([]);
    setSelectedBook(null);
    const loaded = getBooks(scope);
    setBooks(loaded);
    setSelectedBook(loaded[0] ?? null);
  }, [scope]);

  return (
    <BookContext.Provider value={{ selectedBook, setSelectedBook, books, refreshBooks }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBook must be used within a BookProvider');
  return context;
}
