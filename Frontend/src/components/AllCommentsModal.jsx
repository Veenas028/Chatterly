import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import useAuthUser from "../hooks/useAuthUser";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const AllCommentsModal = ({ postId, comments, onClose, onCommentAdded, onCommentDeleted }) => {
  const { authUser } = useAuthUser();
  const [newComment, setNewComment] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comments`, { text: newComment });
      onCommentAdded(res.data);
      setNewComment("");
    } catch (err) {
      console.error("Add comment error:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(commentId));
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      onCommentDeleted(commentId);
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Failed to delete comment");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-2">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg p-3 sm:p-4 max-h-[80vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-lg font-bold">All Comments</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* COMMENT LIST */}
        {comments.map((cmt) => (
          <div
            key={cmt._id}
            className="flex gap-2 items-start mb-3 relative pr-6"
          >
            <Link
              to={cmt.user?._id === authUser._id ? "/my-profile" : `/users/${cmt.user?._id}`}
              className="flex gap-2"
            >
              <img
                src={cmt.user?.profilePic}
                className="w-8 h-8 rounded-full object-cover"
                alt={cmt.user?.fullName}
              />
              <div className="max-w-xs break-words">
                <p className="font-semibold text-sm">{cmt.user?.fullName}</p>
                <p className="text-sm">{cmt.text}</p>
              </div>
            </Link>

            {cmt.user?._id === authUser._id && (
              <button
                className="absolute top-1 right-1"
                onClick={() => handleDelete(cmt._id)}
                disabled={deletingIds.has(cmt._id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        ))}

        {/* ADD NEW COMMENT */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 gap-2">
          <img
            src={authUser.profilePic}
            alt="Me"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex w-full gap-2">
            <input
              className="input input-sm w-full"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary whitespace-nowrap"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCommentsModal;