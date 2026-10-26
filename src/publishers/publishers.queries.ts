export const publisherQueries = {
  readPublishers: `
  SELECT
    id AS id,
    name AS publisherName
  FROM bookshelf.publishers;  
  `
}