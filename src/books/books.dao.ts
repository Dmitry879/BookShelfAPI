import { execute } from '../services/mysql.connector.ts';
import type { Book } from './books.model.ts';
import { bookQueries } from './books.queries.ts';

export const readBooks = async () => {
  return execute<Book[]>(bookQueries.readBooks, []);
};

export const readBookById = async (bookId: number) => {
  return execute<Book[]>(bookQueries.readBookById, [bookId]);
}