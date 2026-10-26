import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import * as BookController from './books.controller.ts';

const router = Router();

router.get('/books', (req, res, next) => {
  if (req.query.id !== undefined) {
    return BookController.readBookById(req, res, next);
  }
  if (req.query.titleSearch !== undefined) {
    return BookController.readBooksByTitleSearch(req, res, next);
  }

  if (req.query.authorSearch != undefined) {
    return BookController.readBooksByAuthorSearch(req, res, next);
  }

  return BookController.readBooks(req, res, next);
});

export default router;