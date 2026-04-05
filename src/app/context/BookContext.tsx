import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { getBooks } from '../utils/storage';

interface BookContextType {
  selectedBook: Book | null;
  setSelectedBook: (book: Book) => void;
  books: Book[];
  refreshBooks: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const refreshBooks = () => {
    const loadedBooks = getBooks();
    setBooks(loadedBooks);
    if (!selectedBook && loadedBooks.length > 0) {
      setSelectedBook(loadedBooks[0]);
    }
  };

  useEffect(() => {
    refreshBooks();
  }, []);

  return (
    <BookContext.Provider value={{ selectedBook, setSelectedBook, books, refreshBooks }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
}