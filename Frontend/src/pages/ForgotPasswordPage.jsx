// src/pages/ForgotPasswordPage.jsx
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/"); // redirect to homepage or dashboard
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="card w-96 p-6 bg-base-200 space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
