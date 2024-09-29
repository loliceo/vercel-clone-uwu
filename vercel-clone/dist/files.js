"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllfiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllfiles = (folderPath) => {
    let response = [];
    const allFilesandFolders = fs_1.default.readdirSync(folderPath);
    allFilesandFolders.forEach(file => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat((0, exports.getAllfiles)(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
exports.getAllfiles = getAllfiles;
