import { PrismaClient } from '@prisma/client'
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient()

// return 403 when user not have session
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    let sessionId = req.headers.authorization
    sessionId = sessionId?.split(' ')?.[1]
    if (!sessionId) {
        res.status(400).json({ error: 'missing authorization header' })
        return
    }
    try {
        const session = await prisma.session.findFirst({ where: { id: sessionId }, select: { user: true } })
        res.locals.user = session?.user
        if (!session) {
            return res.status(400).json({ error: 'invalid session' })
        }
        next()
    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: 'invalid session' })
    }
}