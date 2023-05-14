"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserImage = exports.changeUserMode = exports.setUserState = exports.getUserState = exports.defaultUserState = exports.clearHistory = exports.getHistory = exports.appendHistory = exports.authorize = exports.badAttempt = exports.newUser = exports.isCountExceeded = exports.isAuthorized = exports.isUserExist = void 0;
const process_1 = __importDefault(require("process"));
const mem = {
    users: {},
    history: {},
    userState: {},
};
const isUserExist = (id) => {
    return mem.users[id] !== undefined;
};
exports.isUserExist = isUserExist;
const isAuthorized = (id) => {
    if (JSON.parse(process_1.default.env.AUTHORIZED_IDS).indexOf(id) !== -1) {
        return true;
    }
    return mem.users[id] === true;
};
exports.isAuthorized = isAuthorized;
const isCountExceeded = (id) => {
    const user = mem.users[id];
    if (user !== true) {
        return user >= 3;
    }
    return false;
};
exports.isCountExceeded = isCountExceeded;
const newUser = (id) => {
    mem.users[id] = 0;
};
exports.newUser = newUser;
const badAttempt = (id) => {
    const user = mem.users[id];
    if (user !== true) {
        mem.users[id] = user + 1;
    }
};
exports.badAttempt = badAttempt;
const authorize = (id) => {
    mem.users[id] = true;
};
exports.authorize = authorize;
const appendHistory = (id, role, content) => {
    if (!mem.history[id]) {
        mem.history[id] = [];
    }
    mem.history[id].push({ role, content });
};
exports.appendHistory = appendHistory;
const getHistory = (id) => {
    return mem.history[id];
};
exports.getHistory = getHistory;
const clearHistory = (id) => {
    mem.history[id] = [];
};
exports.clearHistory = clearHistory;
exports.defaultUserState = {
    mode: "text",
};
const getUserState = (id) => {
    return mem.userState[id] || exports.defaultUserState;
};
exports.getUserState = getUserState;
const setUserState = (id, state) => {
    mem.userState[id] = state;
};
exports.setUserState = setUserState;
const changeUserMode = (id, mode) => {
    const userState = (0, exports.getUserState)(id);
    (0, exports.setUserState)(id, Object.assign(Object.assign({}, userState), { mode }));
};
exports.changeUserMode = changeUserMode;
const addUserImage = (id, image) => {
    const userState = (0, exports.getUserState)(id);
    (0, exports.setUserState)(id, Object.assign(Object.assign({}, userState), { userImage: image }));
};
exports.addUserImage = addUserImage;
//# sourceMappingURL=user.js.map