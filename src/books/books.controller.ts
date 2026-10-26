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
    await populateBookAuthors(books);
    res
      .status(200)
      .json(books);
  } catch (error) {
    console.error('[books.controller][readBooks][Error]', error);
    res
      .status(500)
      .json({ message: 'There was an error when fetching books'});
  }
}

export const readBookById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.query.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      res
        .status(400)
        .json({ Message: 'Invalid id parameter'});
        return;
    }
    const book = await BookDao.readBookById(bookId);
    await populateBookAuthors(book);
    res
      .status(200)
      .json(book);
  } catch (error) {
    console.error('[books.controller][readBookById][Error]', error);
    res
      .status(500)
      .json({ message: 'There was an error fetching book by id'});
  }
}

async function populateBookAuthors(books: Book[]): Promise<void> {
  if (books.length === 0) {
    return;
  }

  const bookIds = books.map(book => book.id);

  const authors = await AuthorDao.readAuthorsByBookIds(bookIds);

  for (const book of books) {
    book.authors = authors
                    .filter(author => author.bookId === book.id)
                    .map(({ bookId, ...author}) => author)
  }
}

/* async function readAuthorsByBookId(books: Book[]) {
  for (const book of books) {
    const authors = await AuthorDao.readAuthorsByBookId(book.id);
    book.authors = authors;
  }
} */


