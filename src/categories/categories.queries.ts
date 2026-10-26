export const categoryQueries = {
  readCategories: `
    SELECT
      id AS id,
      name AS categoryName
    FROM bookshelf.categories;
  `
}