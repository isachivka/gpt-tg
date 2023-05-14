import process from "process";

const mem: {
  users: Record<number, number | true>;
  history: Record<number, { role: string; content: string }[]>;
} = {
  users: {},
  history: {},
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
    mem.history[id] = [];
  }
  mem.history[id].push({ role, content });
};

export const getHistory = (id: number) => {
  return mem.history[id];
};

export const clearHistory = (id: number) => {
  mem.history[id] = [];
};
