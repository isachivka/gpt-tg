import type { Telegraf } from 'telegraf';

import pg from '../../db';
import { Key } from '../../db/key';
import { textMode } from '../const';
import type { ModeCommands } from '../const';
import { locales } from '../locales';

const initialUserHistory = [] as const;

export class User {
  mode: ModeCommands;
  id: number;
  auth: boolean;
  badAttempts: number = 0;
  temperature: number = 0.7;
  timeout: ReturnType<typeof setTimeout>;
  history: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
    ...initialUserHistory,
  ];

  constructor(id: number, auth: boolean) {
    this.id = id;
    this.mode = textMode;
    this.auth =
      auth || JSON.parse(process.env.AUTHORIZED_IDS).indexOf(id) !== -1;
  }

  public async authorize(bot: Telegraf, token: string) {
    if (this.auth) {
      return true;
    }

    if (this.badAttempts >= 10) {
      bot.telegram.sendMessage(this.id, locales.en.ban);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.badAttempts = 0;
      }, 1000 * 60 * 10);
      return false;
    }

    const key = await Key.findOne({ where: { token } });
    if (key === null) {
      bot.telegram.sendMessage(this.id, locales.en.wrong, {});
      this.badAttempts++;
      return false;
    }

    pg.User.create({
      userId: this.id,
      auth: true,
      chatId: this.id,
    });
    bot.telegram.sendMessage(this.id, locales.en.authSuccess, {});
    this.auth = true;
    return false;
  }

  public isAuthorized() {
    return this.auth;
  }

  public changeMode(mode: ModeCommands) {
    this.mode = mode;
  }

  public getMode() {
    return this.mode;
  }

  public appendHistory(role: 'user' | 'assistant' | 'system', content: string) {
    this.history.push({ role, content });
  }

  public getHistory() {
    return this.history;
  }

  public clearHistory() {
    this.history = [...initialUserHistory];
  }

  public setTemperature(temperature: number) {
    this.temperature = temperature;
  }

  public getTemperature() {
    return this.temperature;
  }
}
