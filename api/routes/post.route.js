import { create, deletePost, getPosts } from "../controller/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from 'express'

const router = express.Router();

router.post('/create',verifyToken,create);
router.get('/getPosts',getPosts);
router.delete('/deletePost/:postId/:userId',verifyToken,deletePost);

export default router;