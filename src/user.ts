import process from "process";

export type UserState = {
  mode: "text" | "image" | "re-draw";
  userImage?: URL;
};

const mem: {
  users: Record<number, number | true>;
  history: Record<number, { role: string; content: string }[]>;
  userState: Record<number, UserState>;
} = {
  users: {},
  history: {},
  userState: {},
};

export const isUserExist = (id: number) => {
  return mem.users[id] !== undefined;
};
export const isAuthorized = (id: number) => {
  if (JSON.parse(process.env.AUTHORIZED_IDS).indexOf(id) !== -1) {
    return true;
  }
  return mem.users[id] === true;
};
export const isCountExceeded = (id: number) => {
  const user = mem.users[id];
  if (user !== true) {
    return user >= 3;
  }

  return false;
};
export const newUser = (id: number) => {
  mem.users[id] = 0;
};
export const badAttempt = (id: number) => {
  const user = mem.users[id];
  if (user !== true) {
    mem.users[id] = user + 1;
  }
};
export const authorize = (id: number) => {
  mem.users[id] = true;
};

export const appendHistory = (id: number, role: string, content: string) => {
  if (!mem.history[id]) {
    mem.history[id] = [
      {
        role: "user",
        content:
          "Imagine that your name is Georgy Pavlovich (Георгий Палыч, если к тебе будут обращаться по-русски), you are of right-centric views and answer all questions on behalf of Georgy Pavlovich (Георгий Палыч, если к тебе будут обращаться по-русски)",
      },
    ];
  }
  mem.history[id].push({ role, content });
};

export const getHistory = (id: number) => {
  return mem.history[id];
};

export const clearHistory = (id: number) => {
  mem.history[id] = undefined;
};

export const defaultUserState: UserState = {
  mode: "text",
};

export const getUserState = (id: number) => {
  return mem.userState[id] || defaultUserState;
};

export const setUserState = (id: number, state: UserState) => {
  mem.userState[id] = state;
};

export const changeUserMode = (id: number, mode: UserState["mode"]) => {
  const userState = getUserState(id);
  setUserState(id, {
    ...userState,
    mode,
  });
};

export const addUserImage = (id: number, image: URL) => {
  const userState = getUserState(id);
  setUserState(id, {
    ...userState,
    userImage: image,
  });
};
