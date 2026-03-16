
import { useState } from "react";
import AllCommentsModal from "./AllCommentsModal";

const CommentSection = ({ postId, comments = [], onCommentAdded, onCommentDeleted }) => {
  const [showModal, setShowModal] = useState(false);

  const latestComment = comments[comments.length - 1];

  return (
    <div className="mt-4 space-y-2">
      {/* Show one latest comment */}
      {latestComment ? (
        <div className="flex items-start gap-2">
          <img
            src={latestComment.user?.profilePic}
            className="w-8 h-8 rounded-full"
            alt="avatar"
          />
          <div>
            <p className="text-sm font-semibold">{latestComment.user?.fullName}</p>
            <p className="text-sm">{latestComment.text}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm opacity-60">No comments yet.</p>
      )}

      {/* View all comments */}
      {comments.length > 1 && (
        <button
          className="text-xs text-blue-500 hover:underline"
          onClick={() => setShowModal(true)}
        >
          View all {comments.length} comments
        </button>
      )}

      {/* All Comments Modal */}
      {showModal && (
        <AllCommentsModal
          postId={postId}
          comments={comments}
          onClose={() => setShowModal(false)}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
        />
      )}
    </div>
  );
};

export default CommentSection;
