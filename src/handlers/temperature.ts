import { UpdateCtx } from "../types";
import { locales } from "../locales/locales";
import { textMode } from "../modes";
import { send } from "../bot";
import { usersStorage } from "../user/usersStorage";

export const temperatureHandler = (ctx: UpdateCtx) => {
  const user = usersStorage.get(ctx.from.id);
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
