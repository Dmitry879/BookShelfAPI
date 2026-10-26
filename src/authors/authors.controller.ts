import type { Request, RequestHandler, Response } from 'express';
import * as AuthorDao from './authors.dao.ts';

export const readAuthors: RequestHandler = async (req: Request, res: Response) => {
  try {
    const authors = await AuthorDao.readAuthors();
    res.status(200).json(authors);
  } catch (error) {
    console.error('[authors.controller][readAuthors][Error]', error);
    res.status(500).json({ message: 'There was an error when fetching authors' });
  }
}

export const readAuthorsByBookId: RequestHandler = async (req: Request, res: Response) => {
  try {
    let authors;

    const bookId = req.query.bookId;
    if (bookId === undefined) {
      authors = await AuthorDao.readAuthors();
    }
    else {
      if (typeof bookId !== 'string' ||
          !/^[1-9]\d*$/.test(bookId) ||
          !Number.isSafeInteger(Number(bookId))
      ) {
        res
          .status(400)
          .json({ message: 'bookId is invalid'});
        return;
      }
      authors = await AuthorDao.readAuthorsByBookId(Number(bookId));
    }
    res
      .status(200)
      .json(authors)
  } catch (error) {
    console.error('[authors.controller][readAuthorsByBookId][Error]', error);
    res
      .status(500)
      .json({ message: 'There was an error fetching authors by book id'});
  }
}