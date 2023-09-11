import express from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middlewares/requireAuth'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/register', async (req, res) => {
    const {username, password} = req.body
    if (username.length < 5) {
        res.status(403).json({error: 'username need to be at least 5 characters'})
        return
    }
    if (password.length < 5) {
        res.status(403).json({error: 'password need to be at least 5 characters'})
        return
    }
    try {
        // create session immediately after register
        const user = await prisma.user.create({data: {password: password, username: username, imageUrl: '/static/profile_placeholder.png'}, select: {username: true, imageUrl: true, id: true}})
        const session = await prisma.session.create({data: {userId: user.id}})
        res.json({user, session: session.id})
    } catch {
        res.status(403).json({error: `username ${username} already exists`})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await prisma.user.findFirst({where: {username: {equals: username}, password: {equals: password}}})
    if (!user) {
        res.status(403).json({error: 'invalid username or password'})
        return
    }
    const session = await prisma.session.create({data: {userId: user.id}})
    res.json({session: session.id, user})
})

router.get('/check', requireAuth, async (req, res) => {
    res.json({ok: true})
})

export default router
