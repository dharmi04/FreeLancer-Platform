// FreelancerNavBar.js
import React from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa"; // placeholder for notifications
import { GiShare } from "react-icons/gi"; // placeholder for "Share your work"

const FreeLancerNavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-blue-800 text-white px-4 py-2 flex items-center justify-between">
      {/* Left side: Platform name + nav links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          MyPlatform
        </Link>

        {/* Explore */}
        <Link
          to="/freelancer/projects"
          className="hover:bg-blue-700 px-3 py-1 rounded"
        >
          Explore
        </Link>

        {/* Jobs */}
        <Link to="/freelancer/jobs" className="hover:bg-blue-700 px-3 py-1 rounded">
          Jobs
        </Link>
      </div>

      {/* Right side: "Share your work", notifications, profile photo */}
      <div className="flex items-center space-x-4">
        {/* Share your work */}
        <Link
          to="/freelancer/share"
          className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-1 rounded"
        >
          <GiShare />
          <span>Share your work</span>
        </Link>

        {/* Notifications */}
        <button className="relative hover:bg-blue-700 p-2 rounded">
          <FaBell className="text-xl" />
          {/* You can add a badge or dropdown for actual notifications */}
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
          <span className="hover:bg-blue-700 px-3 py-1 rounded">
            {user?.email}
          </span>
        )}
      </div>
    </nav>
  );
};

export default FreeLancerNavBar;
