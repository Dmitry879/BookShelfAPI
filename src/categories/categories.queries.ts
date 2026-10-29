export const categoryQueries = {
  readCategories: `
    SELECT
      id AS id,
      name AS categoryName
    FROM bookshelf.categories;
  `,
  readCategoriesByBookIds: `
    SELECT
      c.id AS id,
      c.name AS name,
      bc.book_id AS bookId
    FROM bookshelf.categories AS c
    INNER JOIN bookshelf.books_categories AS bc
    ON c.id = bc.category_id
    WHERE bc.book_id IN (?);
    `,
    readCategoryByName: `
      SELECT
        id,
        name
      FROM bookshelf.categories
      WHERE name = ?;
    `,
    createCategory: `
      INSERT INTO bookshelf.categories(name)
      VALUES (?);
    `,
    addCategoryToBook: `
      INSERT INTO books_categories (book_id, category_id)
      VALUES (?,?);
    `,
    removeCategoriesFromBook: `
    DELETE FROM bookshelf.books_categories
    WHERE book_id = ?;
  `
}