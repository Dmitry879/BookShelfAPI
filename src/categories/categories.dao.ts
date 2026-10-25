import { execute } from '../services/mysql.connector.ts';
import type { Category } from './categories.model.ts';
import { categoryQueries } from './categories.queries.ts';

export const readCategories = async () => {
  return execute<Category[]>(categoryQueries.readCategories, []);
}