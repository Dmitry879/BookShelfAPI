import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = randomUUID();
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.originalUrl}`);
  next();
}