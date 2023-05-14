"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expressApp = (0, express_1.default)();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;
expressApp.use(express_1.default.static('static'));
expressApp.use(express_1.default.json());
require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
expressApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
bot.launch();
//# sourceMappingURL=index.js.map