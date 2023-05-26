import installer from '@ffmpeg-installer/ffmpeg';
import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import fs, { createReadStream } from 'fs';
import process from 'process';
import { Telegram } from 'telegraf';

import { openai } from '../openai';
import { AudioCtx } from '../types';
import { User } from '../user/user';
import { download, getAudioPaths } from '../utils/download';

setFfmpegPath(installer.path);

export const audioHandler = async (ctx: AudioCtx, user: User) => {
  const telegram = new Telegram(process.env.BOT_KEY);
  const url = await telegram.getFileLink(ctx.message.voice.file_id);
  const paths = getAudioPaths(user.id);
  await download(url.toString(), paths.filePathOga);
  await new Promise<void>((res, rej) => {
    ffmpeg(paths.filePathOga)
      .inputOption('-t 30')
      .output(paths.filePathMp3)
      .on('end', res)
      .on('error', rej)
      .run();
  });
  fs.unlink(paths.filePathOga, (err) => {
    if (err) console.error(err);
  });
  const response = await openai.createTranscription(
    // @ts-ignore
    createReadStream(paths.filePathMp3),
    'whisper-1'
  );
  fs.unlink(paths.filePathMp3, (err) => {
    if (err) console.error(err);
  });
  return response.data.text;
};

export const convertVoiceCtxToText = (id: number, text: string) => {
  return {
    from: {
      id: id,
    },
    chat: {
      id: id,
    },
    update: {
      message: {
        text,
      },
    },
  };
};
