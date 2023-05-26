export const imageMode = 'image_mode';
export const textMode = 'text_mode';
export const gpt4Mode = 'gpt4_mode';
export const setTemperatureMode = 'set_temperature_mode';
export const broadcast = 'broadcast';
export const start = 'start';
export const stats = 'stats';
export const newDialog = 'new_dialog';

export type ModeCommands =
  | typeof imageMode
  | typeof textMode
  | typeof gpt4Mode
  | typeof setTemperatureMode
  | typeof broadcast;
export type OtherCommands = typeof start | typeof stats | typeof newDialog;

/*
image_mode - Image creation mode
text_mode - Chat mode
new_dialog - New dialog
set_temperature_mode - Set temperature
*/
