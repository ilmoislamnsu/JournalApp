import { useAuth } from '../context/AuthContext';
import {
  getBooks, saveBook, deleteBook, getBookById,
  getEntries, getEntriesByBook, saveEntry, deleteEntry, getEntryById,
} from '../utils/storage';
import { Book, JournalEntry } from '../types';

/**
 * Returns storage functions pre-bound to the current user's scope.
 * Logged-in users get their own private namespace.
 * Guests share a separate 'guest' namespace.
 */
export function useStorage() {
  const { user } = useAuth();
  const scope = user?.email ?? 'guest';

  return {
    scope,
    getBooks:         ()                          => getBooks(scope),
    saveBook:         (book: Book)                => saveBook(book, scope),
    deleteBook:       (id: string)                => deleteBook(id, scope),
    getBookById:      (id: string)                => getBookById(id, scope),
    getEntries:       ()                          => getEntries(scope),
    getEntriesByBook: (bookId: string)            => getEntriesByBook(bookId, scope),
    saveEntry:        (entry: JournalEntry)       => saveEntry(entry, scope),
    deleteEntry:      (id: string)                => deleteEntry(id, scope),
    getEntryById:     (id: string)                => getEntryById(id, scope),
  };
}
