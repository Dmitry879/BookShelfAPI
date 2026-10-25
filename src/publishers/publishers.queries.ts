export const publisherQueries = {
  readPublishers: `
  SELECT DISTINCT
    name AS publisherName
  FROM bookshelf.publishers  
  `
}