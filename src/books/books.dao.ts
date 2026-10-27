import type { ResultSetHeader } from 'mysql2';
import { execute } from '../services/mysql.connector.ts';
import { PoolConnection } from 'mysql2/promise';

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

export const readBookByIsbn = async (isbn: string, connection?:PoolConnection) => {
  return execute<Book[]>(bookQueries.readBookByIsbn, [isbn]);
}

export const createBook = async (book: Omit<Book, 'id'>, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(bookQueries.createBook,
                                  [book.title,
                                   book.publisherId,
                                   book.publishDate,
                                   book.isbn,
                                   book.numPages,
                                   book.description],
                                   connection);
}