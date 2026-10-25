export const authorQueries = {
  readAuthors: `
    SELECT
      name AS authorName
    FROM bookshelf.authors;  
    `
}