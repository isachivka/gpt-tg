import { Telegraf } from "telegraf";
import { Ctx } from "./types";

export const bot = new Telegraf(process.env.BOT_KEY);

export const send = (ctx: Ctx, text: string) => {
  return bot.telegram.sendMessage(ctx.chat.id, text, {});
};
