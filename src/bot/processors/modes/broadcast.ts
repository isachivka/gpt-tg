import process from 'process';
import type { Telegraf } from 'telegraf';
import { code } from 'telegraf/format';

import db from '../../../db';
import { textMode } from '../../const';
import type { User } from '../../user/user';

export const broadcastHandler = async (
  bot: Telegraf,
  user: User,
  text: string
) => {
  if (JSON.parse(process.env.AUTHORIZED_IDS).indexOf(user.id) === -1) {
    user.changeMode(textMode);
    return bot.telegram.sendMessage(
      user.id,
      code("You're not authorized to broadcast messages")
    );
  }

  const users = await db.User.findAll();
  const chatIds = users.map((user) => user.userId);

  await Promise.all(
    chatIds.map((chatId) => {
      return bot.telegram.sendMessage(chatId, text);
    })
  );
  user.changeMode(textMode);
  return bot.telegram.sendMessage(user.id, code('Messages sent'));
};
