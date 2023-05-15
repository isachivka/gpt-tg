require("dotenv").config();

import { bot, send } from "./bot";
import { commands } from "./const";
import { usersStorage } from "./user/usersStorage";
import { textHandler } from "./handlers/text";
import express from "express";
import {
  gpt4Mode,
  imageMode,
  modes,
  modesArray,
  reDrawMode,
  setTemperatureMode,
  textMode,
} from "./modes";
import { onPhotoFile, reDrawHandler } from "./handlers/re-draw";
import { imageHandler } from "./handlers/image";
import { locales } from "./locales/locales";
import { temperatureHandler } from "./handlers/temperature";

const expressApp = express();

expressApp.use(express.json());

bot.command(commands.start, (ctx) => {
  if (usersStorage.get(ctx.from.id).isAuthorized()) {
    return send(ctx, locales.en.authWelcome);
  } else {
    return send(ctx, locales.en.woAuthWelcome);
  }
});

modesArray.forEach((mode) => {
  bot.command(mode, (ctx) => {
    usersStorage.get(ctx.from.id).changeMode(mode);
    return send(ctx, modes[mode].text);
  });
});

bot.command(commands.newDialog, (ctx) => {
  const user = usersStorage.get(ctx.from.id);
  user.clearHistory();
  return send(ctx, locales.en.ok);
});

// @ts-ignore
bot.drop(onPhotoFile);

bot.hears(/.*/, (ctx) => {
  const user = usersStorage.get(ctx.from.id);

  if (!user.authorize(ctx.update.message.text, ctx.chat.id)) {
    return;
  }

  switch (user.getMode()) {
    case setTemperatureMode:
      return temperatureHandler(ctx);
    case gpt4Mode:
    case textMode:
      return textHandler(ctx);
    case imageMode:
      return imageHandler(ctx);
    case reDrawMode:
      return reDrawHandler(ctx);
    default:
      return textHandler(ctx);
  }
});

bot.launch().then(() => {
  console.log("Bot started");
});
