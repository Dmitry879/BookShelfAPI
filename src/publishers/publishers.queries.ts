export const publisherQueries = {
  readPublishers: `
  SELECT
    name AS publisherName
  FROM bookshelf.publishers;  
  `
}