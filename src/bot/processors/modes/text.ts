import { OpenAIApi } from 'openai';
import type { Telegraf } from 'telegraf';
import { code } from 'telegraf/format';

import { gpt4Mode, textMode } from '../../const';
import type { User } from '../../user/user';

export const textHandler = async (
  openAI: OpenAIApi,
  bot: Telegraf,
  user: User,
  text: string
) => {
  user.appendHistory('user', text);

  try {
    const response = await openAI.createChatCompletion({
      model: user.getMode() === gpt4Mode ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: user.getHistory(),
      temperature: user.getTemperature(),
    });
    const choice = response.data.choices[0];
    user.appendHistory(choice.message.role, choice.message.content);
    user.changeMode(textMode);
    return bot.telegram.sendMessage(user.id, choice.message.content);
  } catch (error) {
    user.changeMode(textMode);
    return bot.telegram.sendMessage(
      user.id,
      code('Error: ' + JSON.stringify(error))
    );
  }
};
