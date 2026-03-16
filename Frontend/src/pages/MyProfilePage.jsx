import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { axiosInstance } from "../lib/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileDrawer from "../components/ProfileDrawer";
import PostCard from "../components/PostCard";

const MyProfilePage = () => {
  const { authUser } = useAuthUser();
  const [myPosts, setMyPosts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts/my-posts");
        setMyPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch my posts:", err);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar hidden on small, shown on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 w-full">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{authUser?.fullName}</h2>
              <p className="text-sm text-base-content">{authUser?.email}</p>
              <p className="text-sm mt-1 italic">{authUser?.bio || "No bio yet."}</p>
            </div>

            <button
              className="btn btn-outline btn-sm self-center sm:self-start"
              onClick={() => setIsDrawerOpen(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Posts */}
          <h3 className="text-lg sm:text-xl font-semibold mb-4">My Posts</h3>
          {myPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myPosts.map(post => (
                <PostCard key={post._id} post={post} showUserInfo={false} />
              ))}
            </div>
          )}
        </div>

        {/* Profile Drawer */}
        <ProfileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </div>
  );
};

export default MyProfilePage;