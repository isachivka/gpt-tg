import { send } from "../bot";
import { textMode } from "../modes";
import { openai } from "../openai";
import { Reply, UpdateCtx } from "../types";
import { locales } from "../locales/locales";
import { usersStorage } from "../user/usersStorage";
import { imageModeSettings } from "../const";

export const imageHandler = (ctx: UpdateCtx & Reply) => {
  const user = usersStorage.get(ctx.from.id);
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
