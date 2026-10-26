import type { Request, RequestHandler, Response } from 'express';

import type { Book } from './books.model.ts';
import type { Author } from '../authors/authors.models.ts';
import type { Publisher } from '../publishers/publishers.model.ts';
import type { Category } from '../categories/categories.model.ts';

import * as BookDao from './books.dao.ts';
import * as AuthorDao from '../authors/authors.dao.ts';
import * as PublisherDao from '../publishers/publishers.dao.ts';

export const readBooks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const books = await BookDao.readBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error('[books.controller][readBooks][Error]', error);
    res.status(500).json({ message: 'There was an error when fetching books'});
  }
}


