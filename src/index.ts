import path from "path";

require("dotenv").config();

import { bot, send } from "./bot";
import { commands } from "./const";
import { usersStorage } from "./user/usersStorage";
import { textHandler } from "./handlers/text";
import express from "express";
import cors from "cors";
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
import { authMiddleware } from "./api/authMiddleware";
import api from "./api/api";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", express.static(path.resolve(__dirname, "../static")));
app.use(authMiddleware);
app.use(api);

app.listen(3000, () => {
  console.log("Listen 3000");
});

bot.command(commands.start, async (ctx) => {
  const user = await usersStorage.get(ctx.from.id);
  if (user.isAuthorized()) {
    return send(ctx, locales.en.authWelcome);
  } else {
    return send(ctx, locales.en.woAuthWelcome);
  }
});

bot.command(commands.stats, (ctx) => {
  return send(ctx, "Version: " + require("../package.json").version);
});

modesArray.forEach((mode) => {
  bot.command(mode, (ctx) => {
    return usersStorage
      .get(ctx.from.id)
      .then((user) => {
        user.changeMode(mode);
      })
      .then(() => {
        return send(ctx, modes[mode].text);
      });
  });
});

bot.command(commands.newDialog, async (ctx) => {
  const user = await usersStorage.get(ctx.from.id);
  user.clearHistory();
  return send(ctx, locales.en.ok);
});

// @ts-ignore
bot.drop(onPhotoFile);

bot.hears(/.*/, async (ctx) => {
  const user = await usersStorage.get(ctx.from.id);
  const isAuthorized = await user.authorize(
    ctx.update.message.text,
    ctx.chat.id
  );

  if (!isAuthorized) {
    return;
  }

  switch (user.getMode()) {
    case setTemperatureMode:
      return temperatureHandler(ctx, user);
    case gpt4Mode:
    case textMode:
      return textHandler(ctx, user);
    case imageMode:
      return imageHandler(ctx, user);
    case reDrawMode:
      return reDrawHandler(ctx, user);
    default:
      return textHandler(ctx, user);
  }
});

bot.launch().then(() => {
  console.log("Bot started");
});
