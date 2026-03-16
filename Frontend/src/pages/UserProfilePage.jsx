
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  sendFriendRequest,
  getOutgoingFriendReqs,
} from "../lib/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { MessageSquareIcon, UserPlusIcon, CheckCircleIcon } from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserProfilePage = () => {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent");
      queryClient.invalidateQueries(["outgoingFriendReqs"]);
      setOutgoingRequestsIds((prev) => new Set(prev).add(userId));
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  useEffect(() => {
    const ids = new Set();
    if (Array.isArray(outgoingFriendReqs)) {
      outgoingFriendReqs.forEach((req) => {
        if (req?.recipient?._id) {
          ids.add(req.recipient._id);
        }
      });
    }
    setOutgoingRequestsIds(ids);
  }, [outgoingFriendReqs]);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load profile.</p>;

  const { user, posts, areFriends } = profileData;
  const hasRequestBeenSent = outgoingRequestsIds.has(userId);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="avatar self-center sm:self-auto">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.profilePic} alt={user.fullName} />
              </div>
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-sm text-base-content">{user.email}</p>
              <p className="text-sm mt-1 italic">{user.bio || "No bio yet."}</p>

              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                <span className="badge badge-secondary text-xs flex items-center">
                  {getLanguageFlag(user.nativeLanguage)}
                  Native: {user.nativeLanguage}
                </span>
                <span className="badge badge-outline text-xs flex items-center">
                  {getLanguageFlag(user.learningLanguage)}
                  Learning: {user.learningLanguage}
                </span>
              </div>
            </div>

            <div className="mt-2 sm:mt-0">
              {areFriends ? (
                <Link to={`/chat/${userId}`} className="btn btn-primary btn-sm">
                  <MessageSquareIcon className="size-4 mr-2" />
                  Message
                </Link>
              ) : hasRequestBeenSent ? (
                <button className="btn btn-disabled btn-sm">
                  <CheckCircleIcon className="size-4 mr-2" />
                  Request Sent
                </button>
              ) : (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => sendRequestMutation(userId)}
                  disabled={isPending}
                >
                  <UserPlusIcon className="size-4 mr-2" />
                  {isPending ? "Sending..." : "Send Friend Request"}
                </button>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <h3 className="font-semibold text-lg mb-3">Posts</h3>

          {areFriends && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} showUserInfo={false} />
              ))}
            </div>
          ) : areFriends ? (
            <p>No posts to show.</p>
          ) : (
            <p className="italic text-sm opacity-70">
              Add this user as a friend to see their posts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
