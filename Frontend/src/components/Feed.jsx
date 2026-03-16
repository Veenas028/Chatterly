import { useEffect, useState } from "react";
import { getAllPosts } from "../lib/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar: hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 py-6">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 text-base sm:text-lg mt-20">
              No posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  showUserInfo={true}
                  onUpdate={handlePostUpdate}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Feed;