import { useState, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { likePost, unlikePost } from "../lib/api";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import AllCommentsModal from "./AllCommentsModal";
import { Link } from "react-router";

const PostCard = ({ post, showUserInfo = false, onUpdate }) => {
  const { authUser } = useAuthUser();
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = useRef(null);

  const hasLiked = useMemo(
    () => localLikes.includes(authUser._id),
    [localLikes, authUser._id]
  );

  const likeMutation = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: () => {
      const updated = [...localLikes, authUser._id];
      setLocalLikes(updated);
      if (onUpdate) onUpdate({ ...post, likes: updated });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(post._id),
    onSuccess: () => {
      const updated = localLikes.filter((id) => id !== authUser._id);
      setLocalLikes(updated);
      if (onUpdate) onUpdate({ ...post, likes: updated });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () =>
      axiosInstance.post(`/posts/${post._id}/comments`, { text: newComment }),
    onSuccess: (res) => {
      const updated = [...comments, res.data];
      setComments(updated);
      setNewComment("");
      if (onUpdate) onUpdate({ ...post, comments: updated });
    },
    onError: () => toast.error("Failed to add comment"),
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate();
  };

  const latestComment = comments[comments.length - 1];

  return (
    <div className="w-full max-w-[500px] min-h-[600px] mx-auto card bg-base-200 shadow-md p-4 sm:p-6">
      {/* USER INFO */}
      {showUserInfo && post.user && (
        <Link
          to={post.user._id === authUser._id ? "/my-profile" : `/users/${post.user._id}`}
          className="flex items-center gap-3 mb-3 hover:opacity-90"
        >
          <img
            src={post.user.profilePic || "/default-avatar.png"}
            alt={post.user.fullName || "User"}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
          />
          <p className="font-semibold text-sm sm:text-base">{post.user.fullName}</p>
        </Link>
      )}

      {/* POST IMAGE & CAPTION */}
      <img
        src={post.imageUrl}
        alt="Post"
        className="w-full rounded-lg mb-2 max-h-[300px] object-cover"
      />
      {post.caption && <p className="text-sm sm:text-base">{post.caption}</p>}

      {/* LIKE + COMMENT BUTTONS */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button
          className={`btn btn-sm ${hasLiked ? "text-red-500" : "text-gray-500"} hover:scale-110 transition`}
          onClick={() => (hasLiked ? unlikeMutation.mutate() : likeMutation.mutate())}
        >
          {hasLiked ? "❤️" : "🤍"}
        </button>
        <span className="text-sm">
          {localLikes.length} like{localLikes.length !== 1 && "s"}
        </span>

        <button
          className="btn btn-sm btn-ghost"
          onClick={() => commentInputRef.current?.focus()}
        >
          💬 {comments.length} Comment{comments.length !== 1 && "s"}
        </button>
      </div>

      {/* COMMENT INPUT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
        <img
          src={authUser.profilePic}
          alt="Me"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex w-full gap-2">
          <input
            ref={commentInputRef}
            className="input input-sm w-full"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={handleAddComment}
            disabled={!newComment.trim() || commentMutation.isPending}
          >
            Post
          </button>
        </div>
      </div>

      {/* LATEST COMMENT */}
      {latestComment && (
        <div className="mt-2 flex items-start gap-2">
          <Link
            to={latestComment.user?._id === authUser._id ? "/my-profile" : `/users/${latestComment.user?._id}`}
          >
            <img
              src={latestComment.user?.profilePic}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </Link>
          <p className="text-sm break-words">
            <Link
              to={latestComment.user?._id === authUser._id ? "/my-profile" : `/users/${latestComment.user?._id}`}
              className="font-semibold hover:underline"
            >
              {latestComment.user?.fullName}
            </Link>{" "}
            {latestComment.text}
          </p>
        </div>
      )}

      {/* VIEW ALL COMMENTS */}
      {comments.length > 1 && (
        <p
          className="text-sm text-blue-600 cursor-pointer mt-1"
          onClick={() => setShowAllComments(true)}
        >
          View all {comments.length} comments
        </p>
      )}

      {/* TIMESTAMP */}
      <p className="text-xs text-gray-500 mt-3">
        Posted on{" "}
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      {/* MODAL */}
      {showAllComments && (
        <AllCommentsModal
          postId={post._id}
          comments={comments}
          onClose={() => setShowAllComments(false)}
          onCommentAdded={(newComment) =>
            setComments((prev) => [...prev, newComment])
          }
          onCommentDeleted={(commentId) =>
            setComments((prev) => prev.filter((c) => c._id !== commentId))
          }
        />
      )}
    </div>
  );
};

export default PostCard;