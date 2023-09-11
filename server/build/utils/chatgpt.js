"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askChatGPT = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
function askChatGPT(text, apiKey = config_1.chatGptApiKey) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!apiKey) {
            throw Error("process.env.CHATGPT_API_KEY must be set!");
        }
        // use chatgpt default config
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": text }],
            "temperature": 0.7
        };
        // add api key to headers
        const headers = { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
        const res = yield axios_1.default.post('https://api.openai.com/v1/chat/completions', data, { headers });
        const message = (_d = (_c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
        return message !== null && message !== void 0 ? message : '';
    });
}
exports.askChatGPT = askChatGPT;
