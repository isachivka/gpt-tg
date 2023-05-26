import cors from 'cors';
import express from 'express';
import path from 'path';

import type { UsersStorage } from '../bot/user/usersStorage';
import { authMiddleware } from './authMiddleware';
import { getHandlers } from './handlers';

export const initializeApi = (usersStorage: UsersStorage) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/', express.static(path.resolve(__dirname, '../static')));
  app.use(authMiddleware);
  app.use(getHandlers(usersStorage));

  app.listen(3000, () => {
    console.log('Listen 3000');
  });
};
