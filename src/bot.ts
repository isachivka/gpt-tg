import { Telegraf } from "telegraf";
import { Ctx } from "./types";

console.log(process.env.BOT_KEY);

export const bot = new Telegraf(process.env.BOT_KEY);

export const send = (ctx: Ctx, text: string) => {
  return bot.telegram.sendMessage(ctx.chat.id, text, {});
};
