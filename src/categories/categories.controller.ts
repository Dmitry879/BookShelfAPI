import type { Request, RequestHandler, Response } from 'express';
import * as CategoryDao from './categories.dao.ts';

export const readCategories: RequestHandler = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryDao.readCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('[categories.controller]][readCategories][Error]', error);
    res.status(500).json({ message: 'There was an error when fetching publishers' })
  }
}