import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Determine if this is the current user's profile or another user
  const profileId = id || (currentUser ? currentUser._id : null);
  const isOwnProfile = !id || (currentUser && id === currentUser._id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let response;

        if (isOwnProfile) {
          // Fetch current user profile with auth token
          response = await axios.get("http://localhost:5000/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          // Fetch public profile by ID
          response = await axios.get(`http://localhost:5000/api/users/profile/${profileId}`);
        }

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    } else {
      setError("No profile ID available");
      setLoading(false);
    }
  }, [profileId, isOwnProfile, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-gray-700">The requested profile could not be found.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-white">
                {isOwnProfile ? "Your Profile" : `${user.name}'s Profile`}
              </h1>
              {isOwnProfile && (
                <Link 
                  to="/profile/edit" 
                  className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile Image Column */}
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md mb-4">
                  {user.profilePicture ? (
                    <img 
                      src={`http://localhost:5000/${user.profilePicture}`} 
                      alt={`${user.name}'s profile`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-blue-600 font-medium">
                  {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
                </p>
                {isOwnProfile && (
                  <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Profile Details Column */}
              <div className="md:w-2/3 md:pl-6 md:border-l border-gray-200">
                {user.bio ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600 whitespace-pre-line">{user.bio}</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-500 italic">No bio provided</p>
                  </div>
                )}

                {user.role === 'freelancer' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Portfolio Projects</h3>
                    {user.portfolioProjects && user.portfolioProjects.length > 0 ? (
                      <div className="space-y-4">
                        {user.portfolioProjects.map((project, index) => (
                          <div key={index} className="bg-gray-50 rounded-md p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-800">{project.title}</h4>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm inline-flex items-center mt-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No portfolio projects added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;