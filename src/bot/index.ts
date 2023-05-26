import process from 'process';
import { Telegraf, Telegram } from 'telegraf';

import { initializeCommands } from './commands';
import { initializeListeners } from './listeners';
import { UsersStorage } from './user/usersStorage';

export const initializeBot = () => {
  const telegram = new Telegram(process.env.BOT_KEY);
  const bot = new Telegraf(process.env.BOT_KEY);
  const usersStorage = new UsersStorage();

  initializeCommands(bot, usersStorage);
  initializeListeners(telegram, bot, usersStorage);

  bot.launch().then(() => {
    console.log('Bot started');
  });
};
