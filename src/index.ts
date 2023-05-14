require("dotenv").config();

import express from "express";
import { Telegraf } from "telegraf";
import * as process from "process";
import {
  isAuthorized,
  isUserExist,
  newUser,
  clearHistory,
  getUserState,
  changeUserMode,
} from "./user";
import { auth } from "./auth";
import { textMode } from "./text";
import { imageMode } from "./image";
import { onPhotoFile, reDrawMode } from "./re-draw";

const expressApp = express();
const port = process.env.PORT || 3000;

expressApp.use(express.json());

export type Bot = typeof bot;
const bot = new Telegraf(process.env.BOT_KEY);

bot.command("start", (ctx) => {
  console.log(ctx.from.id);
  if (isAuthorized(ctx.from.id)) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Hi, I'm gpt-3.5-turbo by OpenAI. Give me your prompt",
      {}
    );
  } else {
    if (!isUserExist(ctx.from.id)) {
      newUser(ctx.from.id);
    }
    bot.telegram.sendMessage(
      ctx.chat.id,
      "Hi, I'm gpt-3.5-turbo by OpenAI. Before we start give me your access key",
      {}
    );
  }
});

bot.command("new_dialog", (ctx) => {
  clearHistory(ctx.from.id);
  bot.telegram.sendMessage(ctx.chat.id, "👌🏻", {});
});

bot.command("image_mode", (ctx) => {
  changeUserMode(ctx.from.id, "image");
  bot.telegram.sendMessage(ctx.chat.id, "Give me your prompt to draw:", {});
});

bot.command("text_mode", (ctx) => {
  changeUserMode(ctx.from.id, "text");
  bot.telegram.sendMessage(ctx.chat.id, "👌🏻", {});
});

bot.command("re_draw_mode", (ctx) => {
  changeUserMode(ctx.from.id, "re-draw");
  bot.telegram.sendMessage(ctx.chat.id, "Give me your image to re-draw:", {});
});

// @ts-ignore
bot.drop(onPhotoFile(bot));

bot.hears(/.*/, (ctx) => {
  if (!auth(ctx.from.id, ctx.chat.id, ctx.update.message.text, bot)) {
    return;
  }

  switch (getUserState(ctx.from.id).mode) {
    case "text":
      textMode(ctx, bot);
      break;
    case "image":
      imageMode(ctx, bot);
      break;
    case "re-draw":
      reDrawMode(ctx, bot);
      break;
    default:
      textMode(ctx, bot);
  }
});

bot.launch();
