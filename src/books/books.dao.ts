import { execute } from '../services/mysql.connector.ts';
import type { Book } from './books.model.ts';
import { bookQueries } from './books.queries.ts';

export const readBooks = async () => {
  return execute<Book[]>(bookQueries.readBooks, []);
};

export const readBookById = async (bookId: number) => {
  return execute<Book[]>(bookQueries.readBookById, [bookId]);
}

export const readBooksByTitleSearch = async (titleSearch: string) => {
  return execute<Book[]>(bookQueries.readBooksByTitleSearch, [titleSearch]);
}

export const readBooksByAuthorSearch = async (authorSearch: string) => {
  return execute<Book[]>(bookQueries.readBooksByAuthorSearch, [authorSearch]);
}