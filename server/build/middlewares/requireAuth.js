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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// return 403 when user not have session
function requireAuth(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let sessionId = req.headers.authorization;
        sessionId = (_a = sessionId === null || sessionId === void 0 ? void 0 : sessionId.split(' ')) === null || _a === void 0 ? void 0 : _a[1];
        if (!sessionId) {
            res.status(400).json({ error: 'missing authorization header' });
            return;
        }
        try {
            const session = yield prisma.session.findFirst({ where: { id: sessionId }, select: { user: true } });
            res.locals.user = session === null || session === void 0 ? void 0 : session.user;
            if (!session) {
                return res.status(400).json({ error: 'invalid session' });
            }
            next();
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'invalid session' });
        }
    });
}
exports.requireAuth = requireAuth;
