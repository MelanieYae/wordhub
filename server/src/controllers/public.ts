import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { staticPath } from "../config";

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: staticPath,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}${extension}`;
    cb(null, filename);
  },
});

router.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
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
});

router.get("/search", async (req, res) => {
  const { q } = req.query;
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: q as string, mode: 'insensitive' } },
        { user: { username: { contains: q as string, mode: 'insensitive' } } },
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
});

router.post(
  "/upload_image",
  multer({ storage }).single("image"),
  (req, res) => {
    res.json({ url: `/static/${req.file?.filename}` });
  }
);

router.get('/post', async (req, res) => {
  const { id } = req.query
  const post = await prisma.post.findFirst({
    where: { id: id as string }, select: {
      createdAt: true,
      content: true,
      imageUrl: true,
      id: true,
      title: true,
      user: { select: { username: true, imageUrl: true } },
    },
  })

  const commentsCount = await prisma.comment.count({ where: { postId: post?.id } })
  const postWithCommentCount = { ...post, commentsCount }
  res.json(postWithCommentCount ?? {})
})

router.get('/comments', async (req, res) => {
  const { postId } = req.query
  const comments = await prisma.comment.findMany({
    where:
      { postId: { equals: postId as string } },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, imageUrl: true } },
    }
  })
  return res.json(comments)
})




export default router;
