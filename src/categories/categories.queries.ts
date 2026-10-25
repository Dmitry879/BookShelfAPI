export const categoryQueries = {
  readCategories: `
    SELECT
      name AS categoryName
    FROM bookshelf.categories;
  `
}