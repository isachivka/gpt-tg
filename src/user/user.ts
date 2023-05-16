import { Mode, textMode } from "../modes";
import process from "process";
import { bot } from "../bot";
import { locales } from "../locales/locales";
import pg from "../pg";

const initialUserHistory = [
  {
    role: "user" as const,
    content: locales.en.prePrompt,
  },
];

export class User {
  mode: Mode;
  id: number;
  auth: boolean;
  badAttempts: number = 0;
  temperature: number = 0.7;
  timeout: ReturnType<typeof setTimeout>;
  history: { role: "user" | "assistant" | "system"; content: string }[] = [
    ...initialUserHistory,
  ];
  userImage?: URL = undefined;
  userImageMask?: URL = undefined;

  constructor(id: number, auth: boolean) {
    this.id = id;
    this.mode = textMode;
    this.auth =
      auth || JSON.parse(process.env.AUTHORIZED_IDS).indexOf(id) !== -1;
  }

  public authorize(key: string, chatId: number) {
    if (this.auth) {
      return true;
    }

    if (this.badAttempts >= 10) {
      bot.telegram.sendMessage(chatId, locales.en.ban);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.badAttempts = 0;
      }, 1000 * 60 * 10);
      return false;
    }

    if (key !== process.env.ACCESS_KEY) {
      bot.telegram.sendMessage(chatId, locales.en.wrong, {});
      this.badAttempts++;
      return false;
    }

    pg.User.create({
      userId: this.id,
      auth: true,
    });
    bot.telegram.sendMessage(chatId, locales.en.authSuccess, {});
    this.auth = true;
    return true;
  }

  public isAuthorized() {
    return this.auth;
  }

  public changeMode(mode: Mode) {
    this.mode = mode;
  }

  public getMode() {
    return this.mode;
  }

  public appendHistory(role: "user" | "assistant" | "system", content: string) {
    this.history.push({ role, content });
  }

  public getHistory() {
    return this.history;
  }

  public clearHistory() {
    this.history = [...initialUserHistory];
  }

  public addUserImage(image: URL | undefined = undefined) {
    this.userImage = image;
  }

  public addUserImageMask(image: URL | undefined = undefined) {
    this.userImageMask = image;
  }

  public getUserImage() {
    return this.userImage;
  }

  public setTemperature(temperature: number) {
    this.temperature = temperature;
  }

  public getTemperature() {
    return this.temperature;
  }

  public getUserImageMask() {
    return this.userImageMask;
  }
}
