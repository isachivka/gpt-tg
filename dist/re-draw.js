"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPhoto = exports.reDrawMode = void 0;
const process = __importStar(require("process"));
const user_1 = require("./user");
const telegraf_1 = require("telegraf");
require("dotenv").config();
const fs_1 = require("fs");
const openai_1 = require("openai");
const path = __importStar(require("path"));
const configuration = new openai_1.Configuration({
    apiKey: process.env.AI_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const reDrawMode = (ctx, bot) => {
    const userState = (0, user_1.getUserState)(ctx.from.id);
    if (userState.userImage === undefined) {
        bot.telegram.sendMessage(ctx.chat.id, "You don't have image", {});
        return;
    }
    const filename = `image.png`;
    const directory = path.join(process.cwd(), "./");
    const filePath = `${directory}/image.png`;
    openai
        .createImageEdit((0, fs_1.createReadStream)(filePath), ctx.update.message.text, (0, fs_1.createReadStream)(filePath), 1, "256x256")
        .then((res) => {
        console.log(res);
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.reDrawMode = reDrawMode;
const onPhoto = (bot) => (ctx) => {
    if ((0, user_1.getUserState)(ctx.from.id).mode !== "re-draw") {
        bot.telegram.sendMessage(ctx.chat.id, "You are not in re-draw mode", {});
        return;
    }
    const telegram = new telegraf_1.Telegram(process.env.BOT_KEY);
    telegram.getFileLink(ctx.update.message.photo[0].file_id).then((link) => {
        (0, user_1.addUserImage)(ctx.from.id, link);
        bot.telegram.sendMessage(ctx.chat.id, "Now give me prompt", {});
    });
};
exports.onPhoto = onPhoto;
//# sourceMappingURL=re-draw.js.map