// Projects.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import API from "../api"; // or import axios if not using the interceptor
import FreeLancerNavBar from "./Components/FreeLancerNavBar";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch projects");
    }
  };

  // Navigate to details page for a specific project
  const handleViewDetails = (projectId) => {
    navigate(`/freelancer/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <FreeLancerNavBar />
      {/* Header */}
      <header className="flex justify-between items-center mb-4 p-4">
        {/* Left side: link to Dashboard */}
        <a
          href="/freelancer/dashboard"
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Dashboard
        </a>

        {/* Right side: Profile Picture + Email Tooltip */}
        {user ? (
          user.profilePicture ? (
            // If the user has a profile picture, show it with a hover tooltip for email
            <div className="relative group cursor-pointer">
              <img
                src={`http://localhost:5000/${user.profilePicture}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              {/* Tooltip with email on hover */}
              <div className="absolute right-0 top-12 hidden group-hover:block bg-white text-gray-700 text-sm px-3 py-2 rounded shadow">
                {user.email}
              </div>
            </div>
          ) : (
            // If no profile picture, just show a text fallback with email
            <div className="text-gray-700 font-semibold">
              Logged in as: {user.email}
            </div>
          )
        ) : (
          // If no user in localStorage, prompt login
          <div className="text-gray-700 font-semibold">Not logged in</div>
        )}
      </header>

      <h1 className="text-2xl font-bold mb-6 p-4">Available Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded shadow p-4">
            {/* Display Project Image */}
            {project.imageUrl && (
              <div className="mb-2">
                <img
                  src={`http://localhost:5000/${project.imageUrl}`}
                  alt="Project"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}

            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <p className="text-gray-500">
              Budget: <strong>${project.budget}</strong>
            </p>
            <p className="text-gray-500">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>

            {/* View Details Button */}
            <button
              onClick={() => handleViewDetails(project._id)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
