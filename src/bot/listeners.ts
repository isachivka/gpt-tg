import { Configuration, OpenAIApi } from 'openai';
import process from 'process';
import type { Telegraf, Telegram } from 'telegraf';
import { message } from 'telegraf/filters';

import { textProcessor } from './processors/text';
import { voiceProcessor } from './processors/voice';
import type { UsersStorage } from './user/usersStorage';

export const initializeListeners = (
  telegram: Telegram,
  bot: Telegraf,
  usersStorage: UsersStorage
) => {
  const configuration = new Configuration({
    apiKey: process.env.AI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  bot.on(message('voice'), async (ctx) => {
    const user = await usersStorage.get(ctx.from.id);

    if (!user.isAuthorized()) {
      return;
    }

    const url = await telegram.getFileLink(ctx.message.voice.file_id);
    const transcription = await voiceProcessor(openai, user, url);
    return textProcessor(openai, bot, user, transcription);
  });

  bot.on(message('text'), async (ctx) => {
    const user = await usersStorage.get(ctx.from.id);
    const isAuthorized = await user.authorize(bot, ctx.update.message.text);

    if (!isAuthorized) {
      return;
    }

    return textProcessor(openai, bot, user, ctx.message.text);
  });
};
