// hooks/useFriendRequests.js
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

export default function useFriendRequests() {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    staleTime: 10_000,
  });
}
