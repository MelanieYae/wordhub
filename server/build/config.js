"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.staticPath = exports.chatGptApiKey = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../.env' });
exports.chatGptApiKey = process.env.CHATGPT_API_KEY;
exports.staticPath = path_1.default.join(__dirname, '../static');
exports.port = 3000;
