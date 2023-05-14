"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const process_1 = __importDefault(require("process"));
const user_1 = require("./user");
const auth = (id, chatId, text, bot) => {
    if (!(0, user_1.isAuthorized)(id)) {
        if (text === process_1.default.env.ACCESS_KEY) {
            (0, user_1.authorize)(id);
            bot.telegram.sendMessage(chatId, "You are authorized. Give me your prompt", {});
            return true;
        }
        else {
            return false;
        }
    }
    return true;
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map