import type { Request, RequestHandler, Response } from 'express';

import type { Book } from './books.model.ts';
import type { Author } from '../authors/authors.models.ts';
import type { Publisher } from '../publishers/publishers.model.ts';
import type { Category } from '../categories/categories.model.ts';

import * as BookDao from './books.dao.ts';
import * as AuthorDao from '../authors/authors.dao.ts';
import * as CategoryDao from '../categories/categories.dao.ts';
import * as BookService from './books.services.ts';
import type { CreateBookRequest } from './books.requests.ts';
import { validateCreateBookRequest } from './books.requests.ts';
import { BookValidationError } from './books.requests.ts';

export const readBooks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const books = await BookDao.readBooks();

    await populateBookAuthors(books);
    await populateBookCategories(books);

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
    await populateBookCategories(book);

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

export const readBooksByTitleSearch: RequestHandler = async (req: Request, res: Response) => {
  try {
    const books = await BookDao.readBooksByTitleSearch(`%${req.query.titleSearch}%`);
    await Promise.all([
      populateBookAuthors(books),
      populateBookCategories(books)
    ]);
    res
      .status(200)
      .json(books);
  } catch (error) {
    console.error('[books.controller][readBooksByAuthorSearch][Error]', error);
    res
      .status(500)
      .json({ message: 'There was an error fetching books by title search'});
  }
}

export const readBooksByAuthorSearch: RequestHandler = async (req: Request, res: Response) => {
  try {
    const books = await BookDao.readBooksByAuthorSearch(`%${req.query.authorSearch}%`);
    await Promise.all([
      populateBookAuthors(books),
      populateBookCategories(books)
    ]);
    res
      .status(200)
      .json(books);
  } catch (error) {
    console.error('[books.controller][readBooksByAuthorSearch][Error]', error);
    res
      .status(500)
      .json({ message: 'There was an error fetching books by author search'});
  }
}

export const createBook: RequestHandler = async (req: Request, res: Response) => {
  try {
    const request: CreateBookRequest = req.body;

    validateCreateBookRequest(request)

    const bookId: number = await BookService.createBook(request);

    res
      .status(201)
      .json({ message: 'Book created successfully', bookId});

  } catch (error) {
      console.error('[books.controller][createBook][error]', error);

      if (error instanceof BookValidationError) {
        res
          .status(400)
          .json({ message: error.message })
      }

      if (error instanceof Error &&
          error.message === 'A book with this ISBN already exists.'
      ) {
        res
          .status(409)
          .json({ message: error.message });
      }

      res
        .status(500)
        .json({ message: 'Failed to create book'});
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

async function populateBookCategories(books: Book[]): Promise<void> {
  if (books.length === 0) {
    return;
  }

  const bookIds = books.map(book => book.id);

  const categories = await CategoryDao.readCategoriesByBookIds(bookIds);

  for (const book of books) {
    book.categories = categories
                        .filter(category => category.bookId === book.id)
                        .map(({ bookId, ...category}) => category)
  }
}


