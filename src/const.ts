import { gpt4Mode, imageMode, reDrawMode, textMode } from "./modes";

export const imageModeSettings = {
  n: 1,
  size: "512x512" as const,
};

export const reDrawModeSettings = [1, "512x512"] as const;

/*
image_mode - Image creation mode
text_mode - Chat mode
gpt4_mode - GPT-4 mode (waiting for GPT-4)
redraw_mode - Image re-draw mode
new_dialog - New dialog
set_temperature_mode - Set temperature
*/

export const commands = {
  imageMode,
  textMode,
  gpt4Mode,
  reDrawMode,
  start: "start",
  newDialog: "new_dialog",
};
