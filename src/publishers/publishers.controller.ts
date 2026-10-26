import type { Request, RequestHandler, Response } from 'express';
import * as PublisherDao from './publishers.dao.ts';

export const readPublishers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const publishers = await PublisherDao.readPublishers();
    res.status(200).json(publishers);
  } catch (error) {
    console.error('[publishers.controller][readPublishers][Error]', error);
    res.status(500).json({ message: 'There was an error when fetching publishers' });
  }
}