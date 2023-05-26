import express from 'express';

import type { UsersStorage } from '../bot/user/usersStorage';
import db from '../db';

export const getHandlers = (usersStorage: UsersStorage) => {
  const routes = express.Router();

  routes.get('/api/v1/health', (req, res) => {
    res.status(200).send({ status: 'OK' });
  });

  routes.get('/api/v1/keys', async (req, res) => {
    const keys = await db.Key.findAll({ include: db.User });
    res.send(
      keys.map((key) => ({
        id: key.id,
        comment: key.comment,
        users: key.users,
      }))
    );
  });

  routes.post('/api/v1/addToken', async (req, res) => {
    const { token, comment } = req.body;
    const key = await db.Key.create({ token, comment });
    res.send({
      id: key.id,
      comment: key.comment,
      users: key.users,
    });
  });

  routes.delete('/api/v1/rejectToken', async (req, res) => {
    const { id } = req.body;
    const key = await db.Key.findOne({ where: { id }, include: db.User });
    await Promise.all(
      key.users!.map((user) => {
        return usersStorage.get(user.id).then((memoryUser) => {
          memoryUser.unauthorize();
          return user.update({ auth: false });
        });
      })
    );
    await key.destroy();
    res.send({
      ok: true,
    });
  });

  return routes;
};
