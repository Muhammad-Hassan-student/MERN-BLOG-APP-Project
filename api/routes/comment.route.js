import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllUserComments,
  getComments,
  likeComment,
} from "../controller/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);

router.get("/getComments/:postId", getComments);

router.put("/likeComment/:commentId", verifyToken, likeComment);

router.put("/editComment/:commentId", verifyToken, editComment);

router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

router.get("/getAllUsersComments", verifyToken, getAllUserComments);
export default router;
