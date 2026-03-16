import axiosInstance from "./axios";

/* ================= AUTH ================= */

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/signup", signupData);
  return res.data;
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const res = await axiosInstance.post("/auth/onboarding", userData);
  return res.data;
};

/* ================= USERS ================= */

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return res.data;
};

export const updateUserProfile = async (updatedData) => {
  const res = await axiosInstance.put("/users/profile", updatedData);
  return res.data;
};

export const removeFriend = async (friendId) => {
  const res = await axiosInstance.delete(`/users/${friendId}`);
  return res.data;
};

export const getUserProfile = async (userId) => {
  const res = await axiosInstance.get(`/users/${userId}/profile`);
  return res.data;
};

/* ================= CHAT ================= */

/* Create or get conversation */
export const createConversation = async (friendId) => {
 const res = await axiosInstance.post("/conversations", { friendId });
  return res.data;
};

/* Get conversation details */
export const getConversationDetails = async (conversationId) => {
  const res = await axiosInstance.get(`/conversations/${conversationId}/details`);
  return res.data;
};

/* Get messages of conversation */
export const getMessages = async (conversationId) => {
  const res = await axiosInstance.get(`/conversations/${conversationId}/messages`);
  return res.data;
};

/* ================= POSTS ================= */

export const getAllPosts = async () => {
  const res = await axiosInstance.get("/posts");
  return res.data;
};

export const likePost = async (postId) => {
  const res = await axiosInstance.put(`/posts/${postId}/like`);
  return res.data;
};

export const unlikePost = async (postId) => {
  const res = await axiosInstance.put(`/posts/${postId}/unlike`);
  return res.data;
};

export const commentOnPost = async (postId, text) => {
  const res = await axiosInstance.post(`/posts/${postId}/comments`, { text });
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`
  );
  return res.data;
};

