import express from 'express';
import { createPost, deletePost, getPostById, getPosts, updatePost } from '../Controllers/PostController.js';
import { authMiddleware } from '../Middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
