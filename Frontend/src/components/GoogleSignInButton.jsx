// src/components/GoogleSignInButton.jsx
import React from "react";

const GoogleSignInButton = () => {
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5001";
    window.open(`${backendUrl}/api/auth/google`, "_self");
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline btn-accent w-full max-w-xs flex items-center justify-center gap-2"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
