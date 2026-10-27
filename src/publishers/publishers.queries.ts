export const publisherQueries = {
  readPublishers: `
  SELECT
    id AS id,
    name AS publisherName
  FROM bookshelf.publishers;  
  `,
  readPublisherByName: `
    SELECT
      id,
      name
    FROM bookshelf.publishers
    WHERE name = ?
  `,
  createPublisher: `
    INSERT INTO bookshelf.publishers(name)
    VALUES (?);
  `
}