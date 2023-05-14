import { appendHistory, getHistory } from "./user";
import process from "process";
import axios from "axios";
import { Bot } from "./index";

export const textMode = (
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
  },
  bot: Bot
) => {
  appendHistory(ctx.from.id, "user", ctx.update.message.text);

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
};