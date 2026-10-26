import { execute } from '../services/mysql.connector.ts';
import type { Author } from './authors.models.ts';
import { authorQueries } from './authors.queries.ts';

export const readAuthors = async () => {
  return execute<Author[]>(authorQueries.readAuthors, []);
}

export const readAuthorsByBookId = async (bookId: number) => {
  return execute<Author[]>(authorQueries.readAuthorsByBookIds, [bookId])
}