// src/pages/FriendsPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { UsersIcon } from "lucide-react";
import { Link } from "react-router";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
        <Link to="/notifications" className="btn btn-outline btn-sm">
          <UsersIcon className="mr-2 size-4" />
          Friend Requests
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {friends.map((friend) => (
              <div key={friend._id} className="min-w-[250px]">
                <FriendCard friend={friend} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
