import * as process from 'process';
import { Telegram } from 'telegraf';

import { send } from '../bot';
import { reDrawModeSettings } from '../const';
import { locales } from '../locales/locales';
import { reDrawMode, textMode } from '../modes';
import { openai } from '../openai';
import type { Reply, UpdateCtx, UpdateDocCtx } from '../types';
import { User } from '../user/user';
import { usersStorage } from '../user/usersStorage';
import { download, getPaths, removeFiles } from '../utils/download';

export const reDrawHandler = (ctx: UpdateCtx & Reply, user: User) => {
  const { text } = ctx.update.message;
  if (
    user.getUserImage() === undefined ||
    user.getUserImageMask() === undefined
  ) {
    return send(ctx, locales.en.noImage);
  }

  const { filePath, filePathMask } = getPaths(ctx.from.id);

  Promise.all([
    download(user.getUserImage().toString(), filePath),
    download(user.getUserImageMask().toString(), filePathMask),
  ] as const).then((imgs) => {
    return openai
      .createImageEdit(imgs[0], text, imgs[1], ...reDrawModeSettings)
      .then((response) => {
        ctx.replyWithPhoto(response.data.data[0].url);
        user.addUserImage();
        user.addUserImageMask();
        removeFiles({ filePath, filePathMask });
        user.changeMode(textMode);
        return send(ctx, locales.en.backToText);
      })
      .catch((err) => {
        return Promise.all([
          send(ctx, '❗️' + err.message),
          send(ctx, '❗️' + err.response?.data?.error?.message),
        ]);
      });
  });
};

export const onPhotoFile = (ctx: UpdateDocCtx): boolean => {
  const user = usersStorage.getUser_UNSAFE(ctx.from.id);

  if (ctx.update?.message?.document === undefined) {
    return false;
  }

  if (user.getMode() !== reDrawMode) {
    send(ctx, locales.en.noReDraw);
    return true;
  }

  const telegram = new Telegram(process.env.BOT_KEY);

  if (user.getUserImage() === undefined) {
    telegram
      .getFileLink(ctx.update?.message?.document?.file_id)
      .then((link) => {
        user.addUserImage(link);
        return send(ctx, locales.en.giveMask);
      });
  } else {
    telegram
      .getFileLink(ctx.update?.message?.document?.file_id)
      .then((link) => {
        user.addUserImageMask(link);
        return send(ctx, locales.en.givePrompt);
      });
  }

  return true;
};
