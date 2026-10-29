import type { PoolConnectTraceContext, ResultSetHeader } from 'mysql2';
import { execute } from '../services/mysql.connector.ts';
import { PoolConnection } from 'mysql2/promise';

import type { Author } from './authors.models.ts';
import { authorQueries } from './authors.queries.ts';

export const readAuthors = async () => {
  return execute<Author[]>(authorQueries.readAuthors, []);
}

export const readAuthorsByBookId = async (bookId: number) => {
  return execute<Author[]>(authorQueries.readAuthorsByBookIds, [bookId])
}

export const readAuthorsByBookIds = async (bookIds: number[]) => {
  return execute<(Author & { bookId: number })[]>(authorQueries.readAuthorsByBookIds, [bookIds]
  )
}

export const readAuthorByName = async (name: string, connection?: PoolConnection) => {
  return execute<Author[]>(authorQueries.readAuthorByName, [name], connection);
}

export const createAuthor = async (author: Omit<Author, 'id'>, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(authorQueries.createAuthor, [author.name], connection);
}

export const addAuthorToBook = async (bookId: number, authorId: number, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(authorQueries.addAuthorToBook, [bookId, authorId], connection);
}

export const removeAuthorsFromBook = async (bookId: number,
                                            connection: PoolConnection) => {
  return execute<ResultSetHeader>(authorQueries.removeAuthorsFromBook, [bookId], connection);
}