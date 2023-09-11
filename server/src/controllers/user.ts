import express from 'express'
import { PrismaClient, User } from '@prisma/client'
import { requireAuth } from '../middlewares/requireAuth'
import { askChatGPT } from '../utils/chatgpt'

const router = express.Router()
router.use(requireAuth)
const prisma = new PrismaClient()

router.post('/create', async (req, res) => {
    const user = res.locals.user as User
    const { content, title, imageUrl } = req.body
    const { id } = await prisma.post.create({
        data: {
            content: content as string,
            imageUrl: imageUrl,
            title: title,
            userId: user.id
        },
        select: { id: true }
    })
    res.locals.user
    res.json({ id })
})

router.delete('/delete_post', async (req, res) => {
    const { id } = req.query
    console.log(id);
    
    try {
        await prisma.post.delete({ where: { id: id as string } })
        res.json({ id })
    } catch {
        res.json({ error: 'not found' })
    }
})

router.post('/edit', async (req, res) => {
    const user = res.locals.user as User
    const { content, title, id } = req.body
    await prisma.post.update({
        data: {
            content: content as string,
            imageUrl: '',
            title: title,
            userId: user.id
        }, where: { id }
    })
    res.json({ id })
})

router.get('/my_posts', async (req, res) => {
    const user = res.locals.user as User
    const posts = await prisma.post.findMany({
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
})


router.post('/text_generate', async (req, res) => {
    const { q } = req.query
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
    `
    try {
        const result = await askChatGPT(text)
        res.json({ text: result })
    } catch (e) {
        console.log(e)
        res.status(403).json({error: 'unknown error from chatgpt api'})
    }
    
})

router.post('/update_profile', async (req, res) => {
    const userId = res.locals.user.id
    const newUser = req.body
    try {
        const updatedUser = await prisma.user.update({ where: { id: userId }, data: newUser })
        res.json({ user: updatedUser })
    } catch {
        res.status(403).json({error: `username ${newUser?.username} already exists`})
    }
})

router.post('/update_post', async (req, res) => {
    const {id, title, content} = req.body
    const user = res.locals.user as User

    // validate permissions
    const original = await prisma.post.findFirst({where: {id}})
    if (original?.userId !== user.id) {
        res.status(403).json({error: 'not authorized'})
        return
    }
    try {
        await prisma.post.update({where: {id}, data: {title, content}})
        res.json({})
    } catch {
        res.status(401).json({error: 'unknown error'})
    }
})

router.get('/my_post', async (req, res) => {
    const { id } = req.query
    const post = await prisma.post.findFirst({ where: { id: id as string } })
    res.json(post ?? {})
})

router.post('/createComment', async (req, res) => {
    const user = res.locals.user as User
    const {content, postId} = req.body
    await prisma.comment.create({data: {
        userId: user.id,
        postId,
        content  
    }})
    return res.json({})
})

router.post('/deleteComment', async (req, res) => {
    const user = res.locals.user as User
    const {id} = req.body
    const deleted = await prisma.comment.deleteMany({where: {AND: [
        {userId: user.id},
        {id}
    ]}}) // allow user to delete only his comments
    console.log(deleted.count)
    if (deleted.count === 0) {
        return res.status(403).json({error: 'Unauthorized'})
    }
    return res.json({})
})

export default router
