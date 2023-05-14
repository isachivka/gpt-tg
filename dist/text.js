"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textMode = void 0;
const user_1 = require("./user");
const process_1 = __importDefault(require("process"));
const axios_1 = __importDefault(require("axios"));
const textMode = (ctx, bot) => {
    (0, user_1.appendHistory)(ctx.from.id, "user", ctx.update.message.text);
    const config = {
        method: "post",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
            Authorization: "Bearer " + process_1.default.env.AI_KEY,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: (0, user_1.getHistory)(ctx.from.id),
            temperature: 0.7,
        }),
    };
    (0, axios_1.default)(config)
        .then((response) => {
        const choice = response.data.choices[0];
        (0, user_1.appendHistory)(ctx.from.id, choice.message.role, choice.message.content);
        bot.telegram.sendMessage(ctx.chat.id, choice.message.content, {});
    })
        .catch(function (error) {
        bot.telegram.sendMessage(ctx.chat.id, "Error: " + JSON.stringify(error), {});
    });
};
exports.textMode = textMode;
//# sourceMappingURL=text.js.map