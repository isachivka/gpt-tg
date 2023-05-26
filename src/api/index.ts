import cors from 'cors';
import express from 'express';
import path from 'path';

import { authMiddleware } from './authMiddleware';
import handlers from './handlers';

export const initializeApi = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/', express.static(path.resolve(__dirname, '../static')));
  app.use(authMiddleware);
  app.use(handlers);

  app.listen(3000, () => {
    console.log('Listen 3000');
  });
};
