import { useState } from "react";
import { Link, useLocation } from "react-router"; // ensure you're using react-router correctly
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, HomeIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import ProfileDrawer from "./ProfileDrawer";
import useFriendRequests from "../hooks/useFriendRequests"; // import the new hook

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data, isLoading } = useFriendRequests();
  const hasIncomingRequests = !isLoading && data?.incomingReqs?.length > 0;

  const handleProfileClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-end w-full gap-4">
            {!isHomePage && (
              <Link to="/" className="btn btn-sm btn-ghost">
                <HomeIcon className="w-5 h-5" />
              </Link>
            )}

            {/* Notifications */}
            <div className="relative">
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle relative">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                  {hasIncomingRequests && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  )}
                  {hasIncomingRequests && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>
              </Link>
            </div>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Profile Avatar */}
            <div className="avatar cursor-pointer" onClick={handleProfileClick}>
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    authUser?.profilePic ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.fullName || "user"}`
                  }
                  alt="User Avatar"
                />
              </div>
            </div>

            {/* Logout */}
            <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Drawer */}
      <ProfileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
