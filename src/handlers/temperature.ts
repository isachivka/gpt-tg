import { UpdateCtx } from "../types";
import { locales } from "../locales/locales";
import { textMode } from "../modes";
import { send } from "../bot";
import { User } from "../user/user";

export const temperatureHandler = (ctx: UpdateCtx, user: User) => {
  const text = ctx.update.message.text;
  const temperature = Number(text);
  if (isNaN(temperature)) {
    return send(ctx, locales.en.wrongTemperature);
  }
  if (temperature < 0 || temperature > 2) {
    return send(ctx, locales.en.wrongTemperature);
  }
  user.setTemperature(temperature);
  user.changeMode(textMode);
  return send(ctx, locales.en.ok);
};
