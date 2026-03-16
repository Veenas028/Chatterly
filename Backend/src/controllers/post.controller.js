import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE POST
export const createPost = async (req, res) => {
  const { imageUrl, caption } = req.body;
  try {
    const post = await Post.create({
      user: req.user.id,
      imageUrl,
      caption,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

// GET ALL FRIENDS' POSTS (FOR FEED)
export const getAllPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "_id");
    const friendIds = user.friends.map((friend) => friend._id);
   // friendIds.push(req.user._id); // include user's own posts if needed

    const posts = await Post.find({ user: { $in: friendIds } })
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// GET MY POSTS
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .populate("user", "fullName profilePic")
      .populate("comments.user", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};

// LIKE A POST
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }

    res.status(200).json({ message: "Post liked", likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
};

export const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Add new comment
    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    // Populate only the newly added comment's user
    const populatedPost = await Post.findById(postId)
      .select("comments")
      .populate("comments.user", "fullName profilePic");

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json(newComment);
  } catch (err) {
    console.error("Failed to add comment:", err.message);
    res.status(500).json({ message: "Error adding comment" });
  }
};


export const unlikePost = async (req, res) => {
  console.log("unlikePost hit ✅");
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(
      (likeId) => likeId.toString() !== userId.toString()
    );
    await post.save();

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error("Error unliking post:", err.message);
    res.status(500).json({ message: "Failed to unlike post" });
  }
};

export const deleteCommentFromPost = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find comment
    const comment = post.comments.find(
      (c) => c._id.toString() === commentId
    );

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Filter out the comment
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId
    );

    await post.save();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};