import { locales } from './locales/locales';

export const imageMode = 'image_mode';
export const textMode = 'text_mode';
export const gpt4Mode = 'gpt4_mode';
export const reDrawMode = 'redraw_mode';
export const setTemperatureMode = 'set_temperature_mode';

export const broadcast = 'broadcast';

export type Mode =
  | typeof imageMode
  | typeof textMode
  | typeof gpt4Mode
  | typeof reDrawMode
  | typeof setTemperatureMode
  | typeof broadcast;

export const modes = {
  [imageMode]: {
    text: locales.en.drawMessage,
  },
  [textMode]: {
    text: locales.en.ok,
  },
  [gpt4Mode]: {
    text: locales.en.ok,
  },
  [reDrawMode]: {
    text: locales.en.reDrawMessage,
  },
  [setTemperatureMode]: {
    text: locales.en.setTemperature,
  },
  [broadcast]: {
    text: locales.en.broadcast,
  },
};

export const modesArray = [
  imageMode,
  textMode,
  gpt4Mode,
  reDrawMode,
  setTemperatureMode,
  broadcast,
] as const;
