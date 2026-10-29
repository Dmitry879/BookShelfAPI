import { readAuthors } from "./authors.dao.ts";

export const authorQueries = {
  readAuthors: `
    SELECT
      id AS id,
      name AS name
    FROM bookshelf.authors;  
    `,
    readAuthorsByBookId: `
    SELECT
      a.id AS id,
      a.name AS name
    FROM bookshelf.authors AS a
    INNER JOIN bookshelf.books_authors AS ba
    ON a.id = ba.author_id
    WHERE ba.book_id = ?;
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
    `,
  readAuthorByName: `
    SELECT
      id,
      name
    FROM bookshelf.authors
    WHERE name = ?
    `,
  createAuthor: `
    INSERT INTO bookshelf.authors(name)
    VALUES (?);
  `,
  addAuthorToBook: `
    INSERT INTO books_authors (book_id, author_id)
    VALUES (?,?);
  `,
  removeAuthorsFromBook: `
    DELETE FROM books_authors
    WHERE book_id = ?;
  `
}