import express from 'express';
import { Router } from 'express';
import type { Request, Response } from 'express';
import * as PublisherController from './publishers.controllers.ts';

const router = Router();
router
  .route('/publishers')
  .get(PublisherController.readPublishers);

export default router;