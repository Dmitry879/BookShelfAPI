import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import * as AuthorController from './authors.controller.ts';

const router = Router();

router
  .route('/authors')
  .get(AuthorController.readAuthorsByBookId);

export default router;