import React from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { GiShare } from "react-icons/gi";

const FreeLancerNavBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-[#031926] text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left Side: Logo & Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-2xl font-bold text-[#F4E9CD] hover:text-[#77ACA2] transition">
          SkillSync
        </Link>

        <Link to="/freelancer/projects" className="text-[#9DBEBB] hover:text-[#F4E9CD] transition">
          Explore
        </Link>

        <Link to="/freelancer/jobs" className="text-[#9DBEBB] hover:text-[#F4E9CD] transition">
          Jobs
        </Link>
      </div>

      {/* Right Side: Share Work, Notifications, Profile */}
      <div className="flex items-center space-x-6">
        {/* Share Your Work Button */}
        <Link
          to="/freelancer/share"
          className="flex items-center space-x-2 text-[#9DBEBB] hover:text-[#F4E9CD] transition"
        >
          <GiShare className="text-lg" />
          <span>Share Work</span>
        </Link>

        {/* Notifications Button */}
        <button className="relative text-[#9DBEBB] hover:text-[#F4E9CD] transition">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1 rounded-full">
            3
          </span>
        </button>

        {/* Profile Section */}
        {user?.profilePicture ? (
          <div className="relative group cursor-pointer">
            <img
              src={`http://localhost:5000/${user.profilePicture}`}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#468189] hover:border-[#F4E9CD] transition"
            />
            <div className="absolute right-0 top-10 hidden group-hover:block bg-white text-gray-700 text-sm px-4 py-2 rounded shadow">
              {user.email}
            </div>
          </div>
        ) : (
          <span className="text-[#9DBEBB] hover:text-[#F4E9CD] transition">
            {user?.email}
          </span>
        )}
      </div>
    </nav>
  );
};

export default FreeLancerNavBar;
