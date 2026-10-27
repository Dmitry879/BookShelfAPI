import type { Book } from './books.model.ts';
import type { CreateBookRequest } from './books.requests.ts';

import * as BookDao from './books.dao.ts';
import * as AuthorDao from '../authors/authors.dao.ts';
import * as CategoryDao from '../categories/categories.dao.ts';
import * as PublisherDao from '../publishers/publishers.dao.ts';

import type { ResultSetHeader } from 'mysql2';
import { getConnection } from '../services/mysql.connector.ts';
import { get } from 'http';

export const createBook = async (request: CreateBookRequest) => {

  const connection = await getConnection(); // Obtaining a dedicated MySQL connection

  try {
    await connection.beginTransaction(); // Start database transaction on that connection

    // Check if publisher already exists
    const existingPublisher = await PublisherDao.readPublisherByName(request.publisher, connection);

    let publisherId: number;
    if (existingPublisher.length > 0) {
      publisherId = existingPublisher[0]!.id;
    } else {
      const result: ResultSetHeader = await PublisherDao.createPublisher({ name: request.publisher }, connection);
      publisherId = result.insertId;
    }

    // Check if book ISBN already exists
    const existingBooks = await BookDao.readBookByIsbn(request.isbn, connection);
    if (existingBooks.length > 0) {
      throw new Error('A book with this ISBN already exists.');
    }
    
    const result: ResultSetHeader = await BookDao.createBook({ title: request.title,
                                                              publisherId: publisherId,
                                                              publishDate: new Date(request.publishDate),
                                                              isbn: request.isbn,
                                                              numPages: request.numPages,
                                                              description: request.description },
                                                              connection);
    const bookId = result.insertId;

    // Check if authors already exist
    for (const author of request.authors) {
      const existingAuthors = await AuthorDao.readAuthorByName(author.name, connection);

      let authorId: number;
      if (existingAuthors.length > 0) {
        authorId = existingAuthors[0]!.id;
      } else {
        const result = await AuthorDao.createAuthor({ name: author.name }, connection);
        authorId = result.insertId;
      }

      // Associate author with newly created book
      await AuthorDao.addAuthorToBook(bookId, authorId, connection);
    }

    // Check if categories already exist
    for (const category of request.categories) {
      const existingCategories = await CategoryDao.readCategoryByName(category.name, connection);

      let categoryId: number;
      if (existingCategories.length > 0) {
        categoryId = existingCategories[0]!.id;
      } else {
        const result: ResultSetHeader = await CategoryDao.createCategory({ name: category.name }, connection);
        categoryId = result.insertId;
      }

      // Associate category with newly created book
      await CategoryDao.addCategoryToBook(bookId, categoryId, connection);

      throw new Error('Testing transaction rollback'); // TEST TEST TEST

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