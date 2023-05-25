const baseApi = import.meta.env.VITE_BASE_API
  ? import.meta.env.VITE_BASE_API
  : "";

export const endPoints = {
  health: `${baseApi}/api/v1/health`,
  keys: `${baseApi}/api/v1/keys`,
  addToken: `${baseApi}/api/v1/addToken`,
};
