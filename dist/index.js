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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const telegraf_1 = require("telegraf");
const process = __importStar(require("process"));
const user_1 = require("./user");
const auth_1 = require("./auth");
const text_1 = require("./text");
const image_1 = require("./image");
const re_draw_1 = require("./re-draw");
require("dotenv").config();
const expressApp = (0, express_1.default)();
const port = process.env.PORT || 3000;
expressApp.use(express_1.default.json());
const bot = new telegraf_1.Telegraf(process.env.BOT_KEY);
bot.command("start", (ctx) => {
    console.log(ctx.from.id);
    if ((0, user_1.isAuthorized)(ctx.from.id)) {
        bot.telegram.sendMessage(ctx.chat.id, "Hi, I'm gpt-3.5-turbo by OpenAI. Give me your prompt", {});
    }
    else {
        if (!(0, user_1.isUserExist)(ctx.from.id)) {
            (0, user_1.newUser)(ctx.from.id);
        }
        bot.telegram.sendMessage(ctx.chat.id, "Hi, I'm gpt-3.5-turbo by OpenAI. Before we start give me your access key", {});
    }
});
bot.command("new_dialog", (ctx) => {
    (0, user_1.clearHistory)(ctx.from.id);
    bot.telegram.sendMessage(ctx.chat.id, "👌🏻", {});
});
bot.command("image_mode", (ctx) => {
    (0, user_1.changeUserMode)(ctx.from.id, "image");
    bot.telegram.sendMessage(ctx.chat.id, "Give me your prompt to draw:", {});
});
bot.command("text_mode", (ctx) => {
    (0, user_1.changeUserMode)(ctx.from.id, "text");
    bot.telegram.sendMessage(ctx.chat.id, "👌🏻", {});
});
bot.command("re_draw_mode", (ctx) => {
    (0, user_1.changeUserMode)(ctx.from.id, "re-draw");
    bot.telegram.sendMessage(ctx.chat.id, "Give me your image to re-draw:", {});
});
bot.on("photo", (0, re_draw_1.onPhoto)(bot));
bot.hears(/.*/, (ctx) => {
    if (!(0, auth_1.auth)(ctx.from.id, ctx.chat.id, ctx.update.message.text, bot)) {
        return;
    }
    console.log((0, user_1.getUserState)(ctx.from.id).mode);
    switch ((0, user_1.getUserState)(ctx.from.id).mode) {
        case "text":
            (0, text_1.textMode)(ctx, bot);
            break;
        case "image":
            (0, image_1.imageMode)(ctx, bot);
            break;
        case "re-draw":
            (0, re_draw_1.reDrawMode)(ctx, bot);
            break;
        default:
            (0, text_1.textMode)(ctx, bot);
    }
});
bot.launch();
//# sourceMappingURL=index.js.map