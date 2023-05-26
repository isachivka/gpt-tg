import { OpenAIApi } from 'openai';
import { Telegraf } from 'telegraf';
import { code } from 'telegraf/format';

import { textMode } from '../../const';
import { locales } from '../../locales';
import { User } from '../../user/user';

export const imageHandler = async (
  openAI: OpenAIApi,
  bot: Telegraf,
  user: User,
  text: string
) => {
  user.changeMode(textMode);

  try {
    const response = await openAI.createImage({
      prompt: text,
      n: 1,
      size: '512x512' as const,
    });

    bot.telegram.sendMessage(user.id, code(locales.en.backToText));
    return bot.telegram.sendPhoto(user.id, response.data.data[0].url);
  } catch (err) {
    return Promise.all([
      bot.telegram.sendMessage(user.id, code('❗️' + err.message)),
      bot.telegram.sendMessage(
        user.id,
        code('❗️' + err.response.data.error.message)
      ),
    ]);
  }
};
