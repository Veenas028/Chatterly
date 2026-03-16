// routes/post.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts,getMyPosts,likePost,unlikePost,deleteCommentFromPost } from "../controllers/post.controller.js";
import { addCommentToPost } from "../controllers/post.controller.js";

const router = express.Router();
router.use(protectRoute);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/my-posts", getMyPosts);
router.put("/:postId/like", likePost);
router.post("/:postId/comments", addCommentToPost);
router.put("/:postId/unlike", unlikePost); // ✅ /api/posts/:postId/unlike
router.delete("/:postId/comments/:commentId", deleteCommentFromPost); // ✅ /api/posts/:postId/comments/:commentId
export default router;