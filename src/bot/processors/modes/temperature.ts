import type { Telegraf } from 'telegraf';
import { code } from 'telegraf/format';

import { textMode } from '../../const';
import { locales } from '../../locales';
import type { User } from '../../user/user';

export const temperatureHandler = (bot: Telegraf, user: User, text: string) => {
  const temperature = Number(text);
  if (isNaN(temperature)) {
    return bot.telegram.sendMessage(user.id, code(locales.en.wrongTemperature));
  }
  if (temperature < 0 || temperature > 2) {
    return bot.telegram.sendMessage(user.id, code(locales.en.wrongTemperature));
  }
  user.setTemperature(temperature);
  user.changeMode(textMode);
  return bot.telegram.sendMessage(user.id, code(locales.en.ok));
};
