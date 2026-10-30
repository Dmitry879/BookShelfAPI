import express from 'express';
import { Router } from 'express';
import * as BookController from './books.controller.ts';

const router = Router();

router.get('/books', (req, res, next) => {
  
  if (req.query.titleSearch !== undefined) {
    return BookController.readBooksByTitleSearch(req, res, next);
  }

  if (req.query.authorSearch != undefined) {
    return BookController.readBooksByAuthorSearch(req, res, next);
  }

  return BookController.readBooks(req, res, next);
});

router.get('/books/:id', BookController.readBookById);

router.post('/books', BookController.createBook);

router.put('/books/:id', BookController.updateBook);

router.delete('/books/:id', BookController.deleteBook);

export default router;