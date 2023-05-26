import { OpenAIApi } from 'openai';
import { Telegraf } from 'telegraf';

import {
  broadcast,
  gpt4Mode,
  imageMode,
  setTemperatureMode,
  textMode,
} from '../const';
import type { User } from '../user/user';
import { broadcastHandler } from './modes/broadcast';
import { imageHandler } from './modes/image';
import { temperatureHandler } from './modes/temperature';
import { textHandler } from './modes/text';

export const textProcessor = (
  openAI: OpenAIApi,
  bot: Telegraf,
  user: User,
  text: string
) => {
  switch (user.getMode()) {
    case broadcast:
      return broadcastHandler(bot, user, text);
    case setTemperatureMode:
      return temperatureHandler(bot, user, text);
    case gpt4Mode:
    case textMode:
      return textHandler(openAI, bot, user, text);
    case imageMode:
      return imageHandler(openAI, bot, user, text);
    default:
      return textHandler(openAI, bot, user, text);
  }
};
