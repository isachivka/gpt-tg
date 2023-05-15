require("dotenv").config();

import { Configuration, OpenAIApi } from "openai";
import process from "process";

const configuration = new Configuration({
  apiKey: process.env.AI_KEY,
});

export const openai = new OpenAIApi(configuration);
