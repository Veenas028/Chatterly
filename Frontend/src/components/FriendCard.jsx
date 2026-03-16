import { LANGUAGE_TO_FLAG } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend, createConversation } from "../lib/api";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Link } from "react-router";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* =========================
     REMOVE FRIEND
  ========================= */
const removeFriendMutation = useMutation({
    mutationFn: (friendId) => removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["recommendedUsers"]);
      toast.success("Friend removed");
    },
    onError: () => {
      toast.error("Failed to remove friend");
    }
  });

  /* =========================
     START CHAT
  ========================= */
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation) => {
      navigate(`/conversations/${conversation._id}`);
    },
    onError: () => {
      toast.error("Failed to start chat");
    },
  });

  const handleMessage = () => {
    createConversationMutation.mutate(friend._id);
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow w-full max-w-md mx-auto">
      <div className="card-body p-4">

        {/* USER INFO */}
          <Link
          to={`/users/${friend._id}`}
          className="flex flex-col sm:flex-row items-center gap-3 mb-3 hover:opacity-80 text-center sm:text-left"
        >
          <div className="avatar w-16 h-16 rounded-full overflow-hidden shrink-0 mx-auto sm:mx-0">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </Link>


        {/* LANGUAGE BADGES */}
        <div className="flex flex-wrap gap-1.5 mb-3 text-sm">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>

          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={handleMessage}
            className="btn btn-outline btn-sm w-1/2"
          >
            Message
          </button>

          <button
            onClick={() => removeFriendMutation.mutate(friend._id)}
            className="btn btn-error btn-sm w-1/2"
          >
            Remove
          </button>
        </div>

      </div>
    </div>
  );
};

export default FriendCard;


/* =========================
   HELPERS
========================= */

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }

  return null;
}

