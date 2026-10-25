import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import * as CategoryController from './categories.controllers.ts';

const router = Router();
router
  .route('/categories')
  .get(CategoryController.readCategories);

export default router;