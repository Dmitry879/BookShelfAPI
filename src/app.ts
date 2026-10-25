import express from 'express'
import type { Request, Response } from 'express';
import { logger } from './middleware/logger.middleware.ts';

import cors from 'cors';
import helmet from 'helmet';

import publishRouter from './publishers/publishers.routes.ts';
const app = express();

const port = 3000;

if (process.env.NODE_ENV == 'development') {
  app.use(logger);
  console.log(process.env.GREETING + ' in dev mode');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use('/', [publishRouter])

app.get('/', (req: Request, res: Response) => res.send('Greetings from BookShelfAPI'));
app.listen(port, () => console.log(`BookShelfAPI app listening at http://localhost:${port}`));