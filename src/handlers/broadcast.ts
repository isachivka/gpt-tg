import process from 'process';

import { bot, send } from '../bot';
import { textMode } from '../modes';
import db from '../pg';
import { UpdateCtx } from '../types';
import { User } from '../user/user';

export const broadcastHandler = async (ctx: UpdateCtx, user: User) => {
  if (JSON.parse(process.env.AUTHORIZED_IDS).indexOf(user.id) === -1) {
    user.changeMode(textMode);
    return send(ctx, "You're not authorized to broadcast messages");
  }

  const users = await db.User.findAll();
  const chatIds = users.map((user) => user.chatId || user.userId);

  await Promise.all(
    chatIds.map((chatId) => {
      return bot.telegram.sendMessage(chatId, ctx.update.message.text);
    })
  );
  user.changeMode(textMode);
  return send(ctx, 'Messages sent');
};
