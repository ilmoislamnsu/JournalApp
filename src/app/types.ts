export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  bookId: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious';
  tags?: string[];
}

export interface Book {
  id: string;
  name: string;
  color: string;
  icon?: string;
}