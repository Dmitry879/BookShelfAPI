import type { ResultSetHeader } from 'mysql2';
import { execute } from '../services/mysql.connector.ts';
import { PoolConnection } from 'mysql2/promise';

import type { Category } from './categories.model.ts';
import { categoryQueries } from './categories.queries.ts';

export const readCategories = async () => {
  return execute<Category[]>(categoryQueries.readCategories, []);
}

export const readCategoriesByBookIds = async (bookIds: number[]) => {
 return execute<(Category & { bookId: number })[]>(categoryQueries.readCategoriesByBookIds, [bookIds])
}

export const readCategoryByName = async (name: string, connection?: PoolConnection) => {
  return execute<Category[]>(categoryQueries.readCategoryByName, [name], connection);
}

export const createCategory = async (category: Omit<Category, 'id'>, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(categoryQueries.createCategory, [category.name], connection);
}

export const addCategoryToBook = async (bookId: number, categoryId: number, connection?: PoolConnection) => {
  return execute<ResultSetHeader>(categoryQueries.addCategoryToBook, [bookId, categoryId], connection);
}