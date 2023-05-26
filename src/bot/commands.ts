import type { Telegraf } from 'telegraf';
import type { FmtString } from 'telegraf/format';
import { code } from 'telegraf/format';

import {
  broadcast,
  gpt4Mode,
  imageMode,
  newDialog,
  setTemperatureMode,
  start,
  stats,
  textMode,
} from './const';
import type { ModeCommands, OtherCommands } from './const';
import { locales } from './locales';
import type { User } from './user/user';
import type { UsersStorage } from './user/usersStorage';

const modeHandler = (mode: ModeCommands, text: string | FmtString) => {
  return (bot: Telegraf, user: User) => {
    user.changeMode(mode);
    return bot.telegram.sendMessage(user.id, text);
  };
};

const commands = {
  [start]: {
    handler: (bot: Telegraf, user: User) => {
      if (user.isAuthorized()) {
        return bot.telegram.sendMessage(user.id, code(locales.en.authWelcome));
      }

      return bot.telegram.sendMessage(user.id, code(locales.en.woAuthWelcome));
    },
  },
  [stats]: {
    handler: (bot: Telegraf, user: User) => {
      return bot.telegram.sendMessage(
        user.id,
        code(`Version: ${require('../../package.json').version}`)
      );
    },
  },
  [newDialog]: {
    handler: (bot: Telegraf, user: User) => {
      user.clearHistory();
      return bot.telegram.sendMessage(
        user.id,
        code(locales.en.newDialogCreated)
      );
    },
  },
  [broadcast]: { handler: modeHandler(broadcast, code(locales.en.broadcast)) },
  [textMode]: { handler: modeHandler(textMode, code(locales.en.ok)) },
  [imageMode]: { handler: modeHandler(imageMode, code(locales.en.ok)) },
  [gpt4Mode]: { handler: modeHandler(gpt4Mode, code(locales.en.ok)) },
  [setTemperatureMode]: {
    handler: modeHandler(setTemperatureMode, code(locales.en.setTemperature)),
  },
} as const;

export const initializeCommands = (
  bot: Telegraf,
  usersStorage: UsersStorage
) => {
  (Object.keys(commands) as (ModeCommands | OtherCommands)[]).forEach(
    (mode) => {
      bot.command(mode, async (ctx) => {
        const user = await usersStorage.get(ctx.from.id);
        return commands[mode].handler(bot, user);
      });
    }
  );
};
