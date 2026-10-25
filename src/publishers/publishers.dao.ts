import { execute } from '../services/mysql.connector.ts';
import type { Publisher } from './publishers.model.ts';
import { publisherQueries } from './publishers.queries.ts';

export const readPublishers = async () => {
  return execute<Publisher[]>(publisherQueries.readPublishers, []);
}