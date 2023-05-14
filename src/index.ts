import express, { Request, Response } from "express";
import axios from "axios";
import { Telegraf } from "telegraf";
import * as process from "process";
import {
  isAuthorized,
  isUserExist,
  newUser,
  authorize,
  getHistory,
  appendHistory,
  clearHistory,
} from "./user";

require("dotenv").config();

const expressApp = express();
const port = process.env.PORT || 3000;

expressApp.use(express.json());

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
  bot.telegram.sendMessage(ctx.chat.id, "Ok", {});
});

bot.hears(/.*/, (ctx) => {
  if (!isAuthorized(ctx.from.id)) {
    if (ctx.update.message.text === process.env.ACCESS_KEY) {
      authorize(ctx.from.id);
      bot.telegram.sendMessage(
        ctx.chat.id,
        "You are authorized. Give me your prompt",
        {}
      );
    }
  } else {
    const userPrompt = ctx.update.message.text;
    appendHistory(ctx.from.id, "user", userPrompt);

    const config = {
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        Authorization: "Bearer " + process.env.AI_KEY,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: getHistory(ctx.from.id),
        temperature: 0.7,
      }),
    };
    axios(config)
      .then((response) => {
        const choice = response.data.choices[0];
        appendHistory(ctx.from.id, choice.message.role, choice.message.content);
        bot.telegram.sendMessage(ctx.chat.id, choice.message.content, {});
      })
      .catch(function (error) {
        bot.telegram.sendMessage(
          ctx.chat.id,
          "Error: " + JSON.stringify(error),
          {}
        );
      });
  }
});

bot.launch();
