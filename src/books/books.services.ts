import type { Book } from './books.model.ts';
import type { BookRequest, CreateBookRequest } from './books.requests.ts';
import type { UpdateBookRequest } from './books.requests.ts';

import * as BookDao from './books.dao.ts';
import * as AuthorDao from '../authors/authors.dao.ts';
import * as CategoryDao from '../categories/categories.dao.ts';
import * as PublisherDao from '../publishers/publishers.dao.ts';

import type { ResultSetHeader } from 'mysql2';
import type { PoolConnection } from 'mysql2/promise';
import { getConnection } from '../services/mysql.connector.ts';

export const createBook = async (request: CreateBookRequest) => {

  const connection = await getConnection(); // Obtaining a dedicated MySQL connection

  try {
    await connection.beginTransaction(); // Start database transaction on that connection

    const publisherId = await findOrCreatePublisher(request, connection);

    // Check if book ISBN already exists
    const existingBooks = await BookDao.readBookByIsbn(request.isbn, connection);
    if (existingBooks.length > 0) {
      throw new Error('A book with this ISBN already exists.');
    }

    const newBook = buildBook(request, publisherId);
    
    const result: ResultSetHeader = await BookDao.createBook(newBook, connection);
    const bookId = result.insertId;

    // Check if authors already exist
    for (const author of request.authors) {

      const authorId: number = await findOrCreateAuthor(author, connection);

      // Associate author with newly created book
      await AuthorDao.addAuthorToBook(bookId, authorId, connection);
    }

    // Check if categories already exist
    for (const category of request.categories) {

      const categoryId: number = await findOrCreateCategory(category, connection);

      // Associate category with newly created book
      await CategoryDao.addCategoryToBook(bookId, categoryId, connection);

    }

    // Commit transaction after all operations succeed
    await connection.commit();

    return bookId;

  } catch (error) {
      await connection.rollback();
      throw error;
  } finally {
    connection.release();
  }
}

export const updateBook = async (bookId: number, request: UpdateBookRequest) => {

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Check if the book exists
    const existingBooks = await BookDao.readBookById(bookId, connection);
    if (existingBooks.length === 0) {
      throw new Error('Book not found.');
    }

    // Check if ISBN belongs to another book
    const booksWithIsbn = await BookDao.readBookByIsbn(request.isbn, connection);
    if (booksWithIsbn.some(book => book.id !== bookId)) {
      throw new Error('A different book already uses this ISBN.');
    }

    const publisherId = await findOrCreatePublisher(request, connection);

    const updatedBook = buildBook(request, publisherId);
    await BookDao.updateBook({ ...updatedBook, id: bookId}, connection);

    await AuthorDao.removeAuthorsFromBook(bookId, connection);
    for (const author of request.authors) {

      const authorId: number = await findOrCreateAuthor(author, connection);

      // Associate author with the book
      await AuthorDao.addAuthorToBook(bookId, authorId, connection);
    }

    await CategoryDao.removeCategoriesFromBook(bookId, connection);
    for (const category of request.categories) {
      const categoryId = await findOrCreateCategory(category, connection);

      // Associate category with the book
      await CategoryDao.addCategoryToBook(bookId, categoryId, connection);
    }

    await connection.commit();
    return bookId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export const deleteBook = async (bookId: number) => {

  const connection = await getConnection();

  try {

    await connection.beginTransaction();

    const existingBook = await BookDao.readBookById(bookId, connection);
    if (existingBook.length === 0) {
      await connection.rollback();
      return false;
    }

    await BookDao.deleteBook(bookId, connection);

    await connection.commit();

    return true;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findOrCreatePublisher(request: BookRequest,
                                     connection: PoolConnection): Promise<number> {
  // Check if publisher already exists
    const existingPublisher = await PublisherDao.readPublisherByName(request.publisher, connection);

    let publisherId: number;
    if (existingPublisher.length > 0) {
      publisherId = existingPublisher[0]!.id;
    } else {
      const result: ResultSetHeader = await PublisherDao.createPublisher({ name: request.publisher }, connection);
      publisherId = result.insertId;
    }
    return publisherId;
}

function buildBook(request: BookRequest,
                   publisherId: number) {
  return {
    title: request.title,
    publisherId: publisherId,
    publishDate: new Date(request.publishDate),
    isbn: request.isbn,
    numPages: request.numPages,
    description: request.description
  }
}

async function findOrCreateAuthor(author: { name: string },
                                  connection: PoolConnection): Promise<number> {
  const existingAuthors = await AuthorDao.readAuthorByName(author.name, connection);
  if (existingAuthors.length > 0) {
    return existingAuthors[0]!.id;
  }

  const result = await AuthorDao.createAuthor({ name: author.name }, connection);

  return result.insertId;
}

async function findOrCreateCategory(category: { name: string },
                                    connection: PoolConnection
                                    ): Promise<number> {
  const existingCategories = await CategoryDao.readCategoryByName(category.name, connection);
  if (existingCategories.length > 0) {
    return existingCategories[0]!.id;
  }

  const result = await CategoryDao.createCategory(category, connection);

  return result.insertId;
}