"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const downloadFile = (url, fileName) => {
    return (0, axios_1.default)({
        method: "get",
        url: url,
        responseType: "arraybuffer",
    }).then(function (response) {
        fs_1.default.writeFileSync(fileName, response.data);
    });
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=downloadFile.js.map