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
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: config_1.staticPath,
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path_1.default.extname(file.originalname);
        const filename = `${timestamp}${extension}`;
        cb(null, filename);
    },
});
router.get("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.post.findMany({
        take: 10,
        select: {
            createdAt: true,
            imageUrl: true,
            id: true,
            title: true,
            user: { select: { username: true, imageUrl: true } },
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    res.json(posts);
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const posts = yield prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { user: { username: { contains: q, mode: 'insensitive' } } },
            ],
        },
        select: {
            createdAt: true,
            content: true,
            imageUrl: true,
            id: true,
            title: true,
            user: { select: { username: true, imageUrl: true } },
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });
    res.json(posts);
}));
router.post("/upload_image", (0, multer_1.default)({ storage }).single("image"), (req, res) => {
    var _a;
    res.json({ url: `/static/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}` });
});
router.get('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const post = yield prisma.post.findFirst({
        where: { id: id }, select: {
            createdAt: true,
            content: true,
            imageUrl: true,
            id: true,
            title: true,
            user: { select: { username: true, imageUrl: true } },
        },
    });
    const commentsCount = yield prisma.comment.count({ where: { postId: post === null || post === void 0 ? void 0 : post.id } });
    const postWithCommentCount = Object.assign(Object.assign({}, post), { commentsCount });
    res.json(postWithCommentCount !== null && postWithCommentCount !== void 0 ? postWithCommentCount : {});
}));
router.get('/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.query;
    const comments = yield prisma.comment.findMany({
        where: { postId: { equals: postId } },
        select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { username: true, imageUrl: true } },
        }
    });
    return res.json(comments);
}));
exports.default = router;
