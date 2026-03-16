import { useState } from "react";
import { uploadToCloudinary } from "../lib/uploadToCloudinary";
import { axiosInstance } from "../lib/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image.");
    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary(file);
      await axiosInstance.post("/posts", { imageUrl, caption });
      alert("Posted!");
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to post!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
          <div className="bg-base-200 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Caption</label>
              <input
                type="text"
                placeholder="Write something about your post..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreatePost;