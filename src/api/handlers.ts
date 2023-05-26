import express from 'express';

import db from '../db';

const routes = express.Router();

routes.get('/api/v1/health', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

routes.get('/api/v1/keys', async (req, res) => {
  const keys = await db.Key.findAll();
  res.send(keys);
});

routes.post('/api/v1/addToken', async (req, res) => {
  const { token, telegramId } = req.body;
  const key = await db.Key.create({ token, telegramId });
  res.send(key);
});

export default routes;
