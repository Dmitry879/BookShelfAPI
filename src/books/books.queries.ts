export const bookQueries = {
  readBooks: `
    SELECT
      b.title AS bookTitle,
      p.name AS publisher,
      b.publish_date AS publishDate,
      b.isbn AS isbn,
      b.num_pages AS numPages,
      b.description AS description
    FROM bookshelf.books AS b
    LEFT JOIN bookshelf.publishers AS p
    ON b.publisher_id = p.id;
   `
}