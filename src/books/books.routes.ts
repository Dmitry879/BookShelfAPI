import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import * as BookController from './books.controller.ts';

const router = Router();
router
  .route('/books')
  .get(BookController.readBooks);

export default router;