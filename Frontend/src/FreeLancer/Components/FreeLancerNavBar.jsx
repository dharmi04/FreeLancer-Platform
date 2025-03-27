import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Menu, 
  Share2, 
  Search, 
  User, 
  X, 
  Briefcase, 
  Home 
} from "lucide-react";

const FreeLancerNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-blue-600 flex items-center space-x-2 hover:text-blue-700 transition-colors"
        >
          <Share2 className="w-6 h-6" />
          <span>SkillSync</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/freelancer/dashboard" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Home className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Dashboard
          </Link>
          <Link 
            to="/freelancer/projects" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Search className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Explore
          </Link>
          <Link 
            to="/freelancer/jobs" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Briefcase className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Jobs
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative group">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="relative group">
            {user?.profilePicture ? (
              <div className="relative">
                <img
                  src={`http://localhost:5000/${user.profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-all cursor-pointer"
                />
                <div className="absolute right-0 top-12 w-48 hidden group-hover:block bg-white shadow-lg rounded-lg border p-2">
                  <Link 
                    to="/freelancer/profile" 
                    className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <User className="inline-block mr-2 w-4 h-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition-colors text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-gray-700">{user?.email}</span>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/freelancer/dashboard" 
                className="flex items-center text-gray-700 hover:text-blue-600 text-xl"
                onClick={toggleMenu}
              >
                <Home className="mr-4 w-6 h-6" />
                Dashboard
              </Link>
              <Link 
                to="/freelancer/projects" 
                className="flex items-center text-gray-700 hover:text-blue-600 text-xl"
                onClick={toggleMenu}
              >
                <Search className="mr-4 w-6 h-6" />
                Explore Projects
              </Link>
              <Link 
                to="/freelancer/jobs" 
                className="flex items-center text-gray-700 hover:text-blue-600 text-xl"
                onClick={toggleMenu}
              >
                <Briefcase className="mr-4 w-6 h-6" />
                Jobs
              </Link>
              <Link 
                to="/freelancer/share" 
                className="flex items-center text-gray-700 hover:text-blue-600 text-xl"
                onClick={toggleMenu}
              >
                <Share2 className="mr-4 w-6 h-6" />
                Share Work
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FreeLancerNavBar;