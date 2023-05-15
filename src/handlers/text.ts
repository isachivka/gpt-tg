import { send } from "../bot";
import { gpt4Mode, textMode } from "../modes";
import { openai } from "../openai";
import type { UpdateCtx } from "../types";
import { User } from "../user/user";

export const textHandler = (ctx: UpdateCtx, user: User) => {
  user.appendHistory("user", ctx.update.message.text);

  try {
    return openai
      .createChatCompletion({
        model: user.getMode() === gpt4Mode ? "gpt-4" : "gpt-3.5-turbo",
        messages: user.getHistory(),
        temperature: user.getTemperature(),
      })
      .then((response) => {
        const choice = response.data.choices[0];
        user.appendHistory(choice.message.role, choice.message.content);
        user.changeMode(textMode);
        return send(ctx, choice.message.content);
      })
      .catch((error) => {
        user.changeMode(textMode);
        return send(ctx, "Error: " + JSON.stringify(error));
      });
  } catch (error) {
    user.changeMode(textMode);
    return send(ctx, "Error: " + JSON.stringify(error));
  }
};
