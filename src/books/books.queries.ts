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
   `
}