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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const requireAuth_1 = require("../middlewares/requireAuth");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (username.length < 5) {
        res.status(403).json({ error: 'username need to be at least 5 characters' });
        return;
    }
    if (password.length < 5) {
        res.status(403).json({ error: 'password need to be at least 5 characters' });
        return;
    }
    try {
        // create session immediately after register
        const user = yield prisma.user.create({ data: { password: password, username: username, imageUrl: '/static/profile_placeholder.png' }, select: { username: true, imageUrl: true, id: true } });
        const session = yield prisma.session.create({ data: { userId: user.id } });
        res.json({ user, session: session.id });
    }
    catch (_a) {
        res.status(403).json({ error: `username ${username} already exists` });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findFirst({ where: { username: { equals: username }, password: { equals: password } } });
    if (!user) {
        res.status(403).json({ error: 'invalid username or password' });
        return;
    }
    const session = yield prisma.session.create({ data: { userId: user.id } });
    res.json({ session: session.id, user });
}));
router.get('/check', requireAuth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ ok: true });
}));
exports.default = router;
