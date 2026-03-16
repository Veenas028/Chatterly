import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser } from "../lib/api";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const res = await getAuthUser();
      if (res && res.success) {
        // Navigate to dashboard or homepage
        navigate("/"); // or your app's main page
      } else {
        navigate("/login");
      }
    }

    checkUser();
  }, []);

  return <p>Logging you in via Google...</p>;
};

export default GoogleAuthSuccess;
