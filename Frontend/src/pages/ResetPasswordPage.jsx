// src/pages/ResetPasswordPage.jsx
import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

const ResetPasswordPage = () => {
  const { token } = useParams(); // from URL: /reset-password/:token
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { authUser } = useAuthUser();
 

  useEffect(() => {
    if (authUser) {
      navigate("/"); // redirect to homepage or dashboard
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful. You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-96 p-6 bg-base-200 space-y-4">
        <h2 className="text-xl font-bold">Set New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
