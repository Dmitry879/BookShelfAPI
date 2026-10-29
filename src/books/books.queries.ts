import { readBooksByTitleSearch } from "./books.dao.ts";

export const bookQueries = {
  readBooks: `
    SELECT
      b.id AS id,
      b.title AS title,
      p.name AS publisher,
      b.publish_date AS publishDate,
      b.isbn AS isbn,
      b.num_pages AS numPages,
      b.description AS description
    FROM bookshelf.books AS b
    LEFT JOIN bookshelf.publishers AS p
    ON b.publisher_id = p.id;
   `,
   readBookById: `
    SELECT
      b.id AS id,
      b.title AS title,
      p.name AS publisher,
      b.publish_date AS publishDate,
      b.isbn AS isbn,
      b.num_pages AS numPages,
      b.description AS description
    FROM bookshelf.books AS b
    LEFT JOIN bookshelf.publishers AS p
    ON b.publisher_id = p.id
    WHERE b.id = ?;
   `,
   readBooksByTitleSearch: `
    SELECT
      b.id AS id,
      b.title AS title,
      p.name AS publisher,
      b.publish_date AS publishDate,
      b.isbn AS isbn,
      b.num_pages AS numPages,
      b.description AS description
    FROM bookshelf.books AS b
    LEFT JOIN bookshelf.publishers AS p
    ON b.publisher_id = p.id
    WHERE b.title LIKE ?;
   `,
  readBooksByAuthorSearch: `
    SELECT
      b.id AS id,
      b.title AS title,
      p.name AS publisher,
      b.publish_date AS publishDate,
      b.isbn AS isbn,
      b.num_pages AS numPages,
      b.description AS description
    FROM bookshelf.books AS b
    INNER JOIN bookshelf.publishers AS p
    ON b.publisher_id = p.id
    INNER JOIN bookshelf.books_authors AS ba
    ON b.id = ba.book_id
    INNER JOIN bookshelf.authors AS a
    ON ba.author_id = a.id
    WHERE a.name LIKE ?;
    `,
  readBookByIsbn: `
    SELECT
      id,
      isbn
    FROM bookshelf.books
    WHERE isbn = ?;
  `,
  createBook: `
    INSERT INTO bookshelf.books (
      title,
      publisher_id,
      publish_date,
      isbn,
      num_pages,
      description
      )
    VALUES(?,?,?,?,?,?);
  `,
  updateBook: `
    UPDATE bookshelf.books
    SET
      title = ?,
        publisher_id = ?,
        publish_date = ?,
        isbn = ?,
        num_pages = ?,
        description = ?
    WHERE id = ?;
  `,
  deleteBook: `
    DELETE FROM bookshelf.books
    WHERE id = ?;
  `
}