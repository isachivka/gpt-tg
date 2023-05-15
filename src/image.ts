import axios from "axios";
import process from "process";
import { changeUserMode } from "./user";
import { Bot } from "./index";

type ImageGenerationResponse = {
  created: number;
  data: {
    url: string;
  }[];
};

export const imageMode = (
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
  axios
    .post<ImageGenerationResponse>(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: ctx.update.message.text,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_KEY}`,
        },
      }
    )
    .then((response) => {
      ctx.replyWithPhoto(response.data.data[0].url);
    })
    .catch((err) => {
      bot.telegram.sendMessage(ctx.chat.id, "❗️" + err.message, {});
      bot.telegram.sendMessage(
        ctx.chat.id,
        "❗️" + err.response.data.error.message,
        {}
      );
    });

  bot.telegram.sendMessage(ctx.chat.id, "Your mode changed back to text", {});

  changeUserMode(ctx.from.id, "text");
};
