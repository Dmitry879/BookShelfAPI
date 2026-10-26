import { readAuthors } from "./authors.dao.ts";

export const authorQueries = {
  readAuthors: `
    SELECT
      id AS id,
      name AS name
    FROM bookshelf.authors;  
    `,
  readAuthorsByBookIds: `
    SELECT
      ba.book_id AS bookId,
      a.id AS id,
      a.name AS name
    FROM bookshelf.authors AS a
    INNER JOIN bookshelf.books_authors AS ba
    ON a.id = ba.author_id
    WHERE ba.book_id IN (?);
    `
}