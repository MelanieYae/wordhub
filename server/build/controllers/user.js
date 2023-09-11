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
const chatgpt_1 = require("../utils/chatgpt");
const router = express_1.default.Router();
router.use(requireAuth_1.requireAuth);
const prisma = new client_1.PrismaClient();
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const { content, title, imageUrl } = req.body;
    const { id } = yield prisma.post.create({
        data: {
            content: content,
            imageUrl: imageUrl,
            title: title,
            userId: user.id
        },
        select: { id: true }
    });
    res.locals.user;
    res.json({ id });
}));
router.delete('/delete_post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    console.log(id);
    try {
        yield prisma.post.delete({ where: { id: id } });
        res.json({ id });
    }
    catch (_a) {
        res.json({ error: 'not found' });
    }
}));
router.post('/edit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const { content, title, id } = req.body;
    yield prisma.post.update({
        data: {
            content: content,
            imageUrl: '',
            title: title,
            userId: user.id
        }, where: { id }
    });
    res.json({ id });
}));
router.get('/my_posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const posts = yield prisma.post.findMany({
        where: { userId: user.id },
        select: {
            createdAt: true,
            content: true,
            imageUrl: true,
            id: true,
            title: true,
            user: { select: { username: true, imageUrl: true } },
        },
        orderBy: {
            createdAt: 'desc' // get last
        }
    });
    res.json(posts);
}));
router.post('/text_generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const text = `
    act as text generation tool.
    you will receive command, 
    and just give the result without explain
    and without apostrophes or commas
    and if you got error, response with empty text, without error message
    also, dont make too long response, at most 30 words
    "
    ${q}
    "
    `;
    try {
        const result = yield (0, chatgpt_1.askChatGPT)(text);
        res.json({ text: result });
    }
    catch (e) {
        console.log(e);
        res.status(403).json({ error: 'unknown error from chatgpt api' });
    }
}));
router.post('/update_profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const newUser = req.body;
    try {
        const updatedUser = yield prisma.user.update({ where: { id: userId }, data: newUser });
        res.json({ user: updatedUser });
    }
    catch (_b) {
        res.status(403).json({ error: `username ${newUser === null || newUser === void 0 ? void 0 : newUser.username} already exists` });
    }
}));
router.post('/update_post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, content } = req.body;
    const user = res.locals.user;
    // validate permissions
    const original = yield prisma.post.findFirst({ where: { id } });
    if ((original === null || original === void 0 ? void 0 : original.userId) !== user.id) {
        res.status(403).json({ error: 'not authorized' });
        return;
    }
    try {
        yield prisma.post.update({ where: { id }, data: { title, content } });
        res.json({});
    }
    catch (_c) {
        res.status(401).json({ error: 'unknown error' });
    }
}));
router.get('/my_post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const post = yield prisma.post.findFirst({ where: { id: id } });
    res.json(post !== null && post !== void 0 ? post : {});
}));
router.post('/createComment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const { content, postId } = req.body;
    yield prisma.comment.create({ data: {
            userId: user.id,
            postId,
            content
        } });
    return res.json({});
}));
router.post('/deleteComment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    const { id } = req.body;
    const deleted = yield prisma.comment.deleteMany({ where: { AND: [
                { userId: user.id },
                { id }
            ] } }); // allow user to delete only his comments
    console.log(deleted.count);
    if (deleted.count === 0) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    return res.json({});
}));
exports.default = router;
