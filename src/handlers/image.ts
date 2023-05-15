import { send } from "../bot";
import { textMode } from "../modes";
import { openai } from "../openai";
import { Reply, UpdateCtx } from "../types";
import { locales } from "../locales/locales";
import { imageModeSettings } from "../const";
import { User } from "../user/user";

export const imageHandler = (ctx: UpdateCtx & Reply, user: User) => {
  user.changeMode(textMode);
  return openai
    .createImage({
      prompt: ctx.update.message.text,
      ...imageModeSettings,
    })
    .then((response) => {
      ctx.replyWithPhoto(response.data.data[0].url);
      return send(ctx, locales.en.backToText);
    })
    .catch((err) => {
      return Promise.all([
        send(ctx, "❗️" + err.message),
        send(ctx, "❗️" + err.response.data.error.message),
      ]);
    });
};
