import installer from '@ffmpeg-installer/ffmpeg';
import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import fs, { createReadStream } from 'fs';
import { OpenAIApi } from 'openai';
import path from 'path';
import process from 'process';

import type { User } from '../user/user';
import { download } from '../utils/download';

export const voiceProcessor = async (
  openAI: OpenAIApi,
  user: User,
  voiceUrl: URL
) => {
  const rootDir = path.join(process.cwd(), './');
  setFfmpegPath(installer.path);
  const ogaPath = path.resolve(rootDir, `voices/${user.id}.oga`);
  const mp3Path = path.resolve(rootDir, `voices/${user.id}.mp3`);
  await download(voiceUrl.toString(), ogaPath);
  await new Promise<void>((res, rej) => {
    ffmpeg(ogaPath)
      .inputOption('-t 30')
      .output(mp3Path)
      .on('end', res)
      .on('error', rej)
      .run();
  });
  const stream = createReadStream(mp3Path) as any;
  await fs.promises.unlink(ogaPath);
  await fs.promises.unlink(mp3Path);
  const response = await openAI.createTranscription(stream, 'whisper-1');
  return response.data.text as string;
};
