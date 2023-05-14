"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageMode = void 0;
const axios_1 = __importDefault(require("axios"));
const process_1 = __importDefault(require("process"));
const user_1 = require("./user");
const imageMode = (ctx, bot) => {
  axios_1.default
    .post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: ctx.update.message.text,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process_1.default.env.AI_KEY}`,
        },
      }
    )
    .then((response) => {
      ctx.replyWithPhoto(response.data.data[0].url);
      console.log(response.data.data[0].url);
    });
  bot.telegram.sendMessage(ctx.chat.id, "Your mode changed back to text", {});
  (0, user_1.changeUserMode)(ctx.from.id, "text");
};
exports.imageMode = imageMode;
//# sourceMappingURL=image.js.map
