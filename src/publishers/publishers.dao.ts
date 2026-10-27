import type { ResultSetHeader } from 'mysql2';
import { execute } from '../services/mysql.connector.ts';
import { PoolConnection } from 'mysql2/promise';

import type { Publisher } from './publishers.model.ts';
import { publisherQueries } from './publishers.queries.ts';

export const readPublishers = async () => {
  return execute<Publisher[]>(publisherQueries.readPublishers, []);
}

export const readPublisherByName = async (name: string, connection?: PoolConnection) => {
  return execute<Publisher[]>(publisherQueries.readPublisherByName, [name], connection);
}

export const createPublisher = async (publisher: Omit<Publisher, 'id'>, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(publisherQueries.createPublisher, [publisher.name], connection);
}