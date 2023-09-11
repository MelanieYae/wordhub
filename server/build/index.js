"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./controllers/auth"));
const user_1 = __importDefault(require("./controllers/user"));
const public_1 = __importDefault(require("./controllers/public"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/static', express_1.default.static(config_1.staticPath));
app.use('/auth', auth_1.default);
app.use('/public', public_1.default);
app.use('/user', user_1.default);
app.listen(config_1.port, () => {
    console.log(`Server running at http://localhost:${config_1.port}`);
});
