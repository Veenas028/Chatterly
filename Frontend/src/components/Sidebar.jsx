import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UsersIcon,
  ImageIcon, // <- Feed icon
} from "lucide-react";
import useFriendRequests from "../hooks/useFriendRequests";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { data, isLoading } = useFriendRequests();
  const hasIncomingRequests = !isLoading && data?.incomingReqs?.length > 0;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Chatterly
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {/* Home */}
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        {/* Friends */}
        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        {/* Feed (NEW) */}
        <Link
          to="/feed"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/feed" ? "btn-active" : ""
          }`}
        >
          <ImageIcon className="size-5 text-base-content opacity-70" />
          <span>Feed</span>
        </Link>

        {/* Notifications */}
        <div className="relative flex items-center gap-2">
          <Link to="/notifications" className="relative flex items-center gap-1">
            <button className="btn btn-ghost btn-circle relative">
              <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              {hasIncomingRequests && (
                <>
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
                </>
              )}
            </button>
            <span className="text-sm font-medium">Notifications</span>
          </Link>
        </div>
      </nav>

      {/* Profile Summary */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;