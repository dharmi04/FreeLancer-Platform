import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FreeLancerDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "freelancer") {
      navigate("/login");
    } else {
      fetchFreelancerProjects();
    }
  }, []);

  const fetchFreelancerProjects = async () => {
    if (!user?._id) {
      console.error("User ID is missing. Cannot fetch projects.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/projects/by-freelancer/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      alert("Error fetching your projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">SkillSync</h2>
        <nav className="flex flex-col gap-4">
          <button onClick={() => navigate("/freelancer/projects")} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
            Explore Projects
          </button>
          <button onClick={() => navigate("/my-jobs")} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
            Jobs
          </button>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-500 py-2 mt-6 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
          <span className="text-gray-700">Hello, {user?.name}</span>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Freelancer Applied Projects */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Projects You've Applied For</h2>
              {projects.length === 0 ? (
                <p>No applied projects.</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                      {/* Left Side - Project Info */}
                      <div>
                        <h3 className="text-lg font-bold">{project.title}</h3>
                        <p className="text-gray-600">Budget: ${project.budget}</p>
                        <p className="text-gray-500">
                          Client: {project.client.name} ({project.client.email})
                        </p>
                      </div>
                      
                      {/* Right Side - Status */}
                      <div>
                        <span className={`px-3 py-1 rounded text-white ${project.status === "In Progress" ? "bg-green-500" : "bg-red-500"}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default FreeLancerDashboard;
