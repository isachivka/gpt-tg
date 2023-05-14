import process from "process";
import { authorize, isAuthorized } from "./user";
import type { Bot } from "./index";

export const auth = (id: number, chatId: number, text: string, bot: Bot) => {
  if (!isAuthorized(id)) {
    if (text === process.env.ACCESS_KEY) {
      authorize(id);
      bot.telegram.sendMessage(
        chatId,
        "You are authorized. Give me your prompt",
        {}
      );
      return true;
    } else {
      return false;
    }
  }
  return true;
};
