import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // For quick stats
  const [openCount, setOpenCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Get user & token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // On mount, ensure user is "client" & fetch projects
  useEffect(() => {
    if (!token || user?.role !== "client") {
      navigate("/login"); // Not a client or not logged in
    } else {
      fetchMyProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch projects from /api/projects/my-projects
  const fetchMyProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects/my-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats (open, in progress, completed)
  const calculateStats = (projectsData) => {
    const open = projectsData.filter((p) => p.status === "open").length;
    const inProgress = projectsData.filter((p) => p.status === "in progress").length;
    const completed = projectsData.filter((p) => p.status === "completed").length;

    setOpenCount(open);
    setInProgressCount(inProgress);
    setCompletedCount(completed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddProject = () => {
    // Navigate to a page/form to create a new project
    navigate("/client/AddProject");
  };

  const handleViewProject = (projectId) => {
    // Navigate to a Project Details page
    navigate(`/client/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Client Dashboard</h1>
        <div>
          <span className="mr-4">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats & New Project */}
      <main className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-700">{openCount}</h2>
                <p className="text-sm text-gray-500">Open Projects</p>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-700">{inProgressCount}</h2>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
              <div className="bg-white rounded shadow p-4 text-center">
                <h2 className="text-2xl font-bold text-gray-700">{completedCount}</h2>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>

            {/* Top Bar: Title + New Project Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Projects</h2>
              <button
                onClick={handleAddProject}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + New Project
              </button>
            </div>

            {/* Projects List */}
            {projects.length === 0 ? (
              <p>You have no projects yet. Click "New Project" to create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-700 mb-1">{project.description}</p>
                    <p className="text-sm text-gray-500 mb-1">Budget: ${project.budget}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">Status: {project.status}</p>

                    <button
                      onClick={() => handleViewProject(project._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
