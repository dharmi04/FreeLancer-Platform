// Projects.js
import React, { useEffect, useState } from "react";
import API from "../api"; // or import axios if you're not using the interceptor

const Projects = () => {
  const [projects, setProjects] = useState([]);
  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // If using interceptor:
      const response = await API.get("/projects");
      // If not using interceptor:
      // const token = localStorage.getItem("token");
      // const response = await axios.get("http://localhost:5000/api/projects", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch projects");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-end items-center mb-4">
        {user && (
          <span className="text-gray-700 font-semibold">
            Logged in as: {user.email}
          </span>
        )}
      </header>

      <h1 className="text-2xl font-bold mb-6">Available Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <p className="text-gray-500">
              Budget: <strong>${project.budget}</strong>
            </p>
            <p className="text-gray-500">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
