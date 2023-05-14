require("dotenv").config();
import * as process from "process";
import { addUserImage, getUserState } from "./user";
import type { Bot } from "./index";
import { Telegram } from "telegraf";
import fs, { createReadStream } from "fs";

import { Configuration, OpenAIApi } from "openai";
import * as path from "path";
import { downloadImage } from "./download";

const configuration = new Configuration({
  apiKey: process.env.AI_KEY,
});
const openai = new OpenAIApi(configuration);

export const reDrawMode = (
  ctx: {
    from: {
      id: number;
    };
    chat: {
      id: number;
    };
    update: {
      message: {
        text: string;
      };
    };
    replyWithPhoto: (image: string) => void;
  },
  bot: Bot
) => {
  const userState = getUserState(ctx.from.id);

  if (userState.userImage === undefined) {
    bot.telegram.sendMessage(ctx.chat.id, "You don't have image", {});
    return;
  }

  const filename = `${ctx.from.id}.png`;
  const directory = path.join(process.cwd(), "./");
  const filePath = `${directory}${filename}`;
  downloadImage(userState.userImage.toString(), filePath).then(() => {
    openai
      .createImageEdit(
        createReadStream(filePath) as any,
        ctx.update.message.text,
        createReadStream(filePath) as any,
        1,
        "1024x1024"
      )
      .then((response) => {
        ctx.replyWithPhoto(response.data.data[0].url);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      })
      .catch((err) => {
        console.log(err.request);
        console.log(err.response);
        console.log(JSON.stringify(err));
        console.log(JSON.stringify(err.data));
        bot.telegram.sendMessage(ctx.chat.id, "❗️" + err.message, {});
        bot.telegram.sendMessage(
          ctx.chat.id,
          "❗️" + err.response.data.error.message,
          {}
        );
      });
  });
};

export const onPhotoFile =
  (bot: Bot) =>
  (ctx: {
    from: {
      id: number;
    };
    chat: {
      id: number;
    };
    update?: {
      message?: {
        document?: {
          file_id?: string;
          file_unique_id?: string;
        };
      };
    };
  }): boolean => {
    if (ctx.update?.message?.document === undefined) {
      return false;
    }

    if (getUserState(ctx.from.id).mode !== "re-draw") {
      bot.telegram.sendMessage(ctx.chat.id, "You are not in re-draw mode", {});
      return true;
    }

    const telegram = new Telegram(process.env.BOT_KEY);

    telegram
      .getFileLink(ctx.update?.message?.document?.file_id)
      .then((link) => {
        addUserImage(ctx.from.id, link);
        bot.telegram.sendMessage(ctx.chat.id, "Now give me prompt", {});
      });
    return true;
  };
