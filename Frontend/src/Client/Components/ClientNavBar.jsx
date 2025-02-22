// ClientNavBar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const ClientNavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-green-800 text-white px-4 py-2 flex items-center justify-between">
      {/* Left side: Platform name + nav links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          MyPlatform
        </Link>

        {/* Dashboard */}
        <Link
          to="/client/dashboard"
          className="hover:bg-green-700 px-3 py-1 rounded"
        >
          Dashboard
        </Link>

        {/* My Projects */}
        <Link to="/client/projects" className="hover:bg-green-700 px-3 py-1 rounded">
          My Projects
        </Link>

        {/* Freelancers */}
        <Link to="/client/freelancers" className="hover:bg-green-700 px-3 py-1 rounded">
          Freelancers
        </Link>
      </div>

      {/* Right side: notifications, profile photo */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative hover:bg-green-700 p-2 rounded">
          <FaBell className="text-xl" />
        </button>

        {/* Profile Photo */}
        {user?.profilePicture ? (
          <div className="relative group cursor-pointer">
            <img
              src={`http://localhost:5000/${user.profilePicture}`}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            {/* Hover tooltip with email */}
            <div className="absolute right-0 top-10 hidden group-hover:block bg-white text-gray-700 text-sm px-3 py-2 rounded shadow">
              {user.email}
            </div>
          </div>
        ) : (
          <span className="hover:bg-green-700 px-3 py-1 rounded">
            {user?.email}
          </span>
        )}
      </div>
    </nav>
  );
};

export default ClientNavBar;
