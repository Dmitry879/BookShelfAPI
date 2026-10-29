import type { Request, RequestHandler, Response } from 'express';

import type { Book } from './books.model.ts';

import * as BookDao from './books.dao.ts';
import * as AuthorDao from '../authors/authors.dao.ts';
import * as CategoryDao from '../categories/categories.dao.ts';
import * as BookService from './books.services.ts';
import type { CreateBookRequest, UpdateBookRequest } from './books.requests.ts';
import { validateBookRequest } from './books.requests.ts';
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

    validateBookRequest(request)

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

export const updateBook: RequestHandler = async (req: Request, res: Response) => {
  try {
    const request: UpdateBookRequest = req.body;
    validateBookRequest(request);
    const bookId = Number(req.query.id);
    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      res
        .status(400)
        .json({ message: 'Invalid book ID.'});
      return;
    }
    await BookService.updateBook(bookId, request);
    res
      .status(200)
      .json({ message: 'Book updated successfully.', bookId});
  } catch (error) {
    if (error instanceof BookValidationError) {
      res
        .status(400)
        .json({ message: error.message});
      return;
    }
    if (error instanceof Error && error.message === 'Book not found.') {
      res
        .status(404)
        .json({ message: error.message})
      return;
    }
    if ((error instanceof Error && error.message === 'A different book already uses this ISBN.') ||
         typeof error === 'object' && error != null && 'code' in error && error.code === 'ER_DUP_ENTRY') {
          res
            .status(409)
            .json({ message: 'A book with this ISBN already exists.' });
          return;
         }
    console.error('[books.controller][updateBook][error]', error);
    res
      .status(500)
      .json({ message: 'There was an error updating the book.'});
  }
}

export const deleteBook: RequestHandler = async (req: Request, res: Response) => {

  try {

    const bookId = Number(req.query.id);

    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      res
        .status(400)
        .json({ message: 'Invalid book ID.'});
      return;
    }

    // Call service method
    const deleted = await BookService.deleteBook(bookId);

    // Check whether book exists
    if (!deleted) {
      res
        .status(404)
        .json({ message: 'Book not found.'});
      return;
    }

    // Successful deletion
    res
      .status(200)
      .json({ message: 'Book deleted successfully.', bookId});

  } catch (error) {
    console.error('[book.controller][deleteBook][error]', error);
    res
      .status(500)
      .json({ message: 'There was an error deleting the book.'});
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


