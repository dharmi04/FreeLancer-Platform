import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { 
  FolderOpenIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  LogOutIcon,
  ActivityIcon,
  ClipboardListIcon
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectUpdates, setProjectUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // For quick stats
  const [openCount, setOpenCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Get user & token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const clientId = user?.id;

  const fetchProjectUpdates = async () => {
    try {
        const token = localStorage.getItem('token'); // Adjust based on where you store the token
        const response = await fetch('http://localhost:5000/api/projects/project-updates', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Ensure correct format
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching project updates:', error);
    }
};


  // On mount, ensure user is "client" & fetch projects
  useEffect(() => {
    if (!token || user?.role !== "client") {
      navigate("/login");
    } else {
      fetchMyProjects();
      fetchProjectUpdates();
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

 
  // Fetch project updates from the new comprehensive endpoint
  // Extract clientId from user object

// Fetch project updates from the new comprehensive endpoint
const fetchClientUpdates = async () => {
  if (!clientId) return; // Ensure clientId exists before making the request

  try {
    const response = await fetch(`/api/project/project-updates?clientId=${clientId}`);
    const data = await response.json();
    setProjectUpdates(data.updates);
  } catch (error) {
    console.error("Error fetching project updates:", error);
  }
};

// Ensure useEffect runs only when clientId is available
useEffect(() => {
  if (clientId) {
    fetchClientUpdates();
  }
}, [clientId]);

  

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
    navigate("/client/AddProject");
  };

  const handleViewProject = (projectId) => {
    navigate(`/client/projects/${projectId}`);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in progress': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with gradient and shadow */}
      <header className="bg-white shadow-md border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/api/placeholder/40/40" 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <span className="text-gray-700 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats and Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                  <FolderOpenIcon className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                  <h2 className="text-2xl font-bold text-blue-600">{openCount}</h2>
                  <p className="text-xs text-gray-500">Open</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                  <ClockIcon className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                  <h2 className="text-2xl font-bold text-yellow-600">{inProgressCount}</h2>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                  <CheckCircleIcon className="w-8 h-8 mx-auto text-green-500 mb-2" />
                  <h2 className="text-2xl font-bold text-green-600">{completedCount}</h2>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <button
                  onClick={handleAddProject}
                  className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors mb-3"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create New Project
                </button>
              </div>
            </div>

            {/* Right Column - Projects and Updates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Project Updates */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <ActivityIcon className="w-6 h-6 mr-2 text-blue-500" />
                    Recent Project Updates
                  </h2>
                </div>

                {projectUpdates.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <ClipboardListIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No recent project updates</p>
                    <p className="text-sm">Freelancers will share progress soon</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectUpdates.map((update, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {update.projectTitle}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {update.freelancerName} updated progress
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(update.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${update.progress.replace('%', '')}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {update.progress}
                          </span>
                        </div>
                        {update.note && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{update.note}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Projects Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
                  <button
                    onClick={handleAddProject}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p className="text-lg">You have no projects yet.</p>
                    <p className="text-sm">Click "New Project" to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div 
                        key={project._id} 
                        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                      >
                        {/* Project Image */}
                        {project.imageUrl && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={`http://localhost:5000/${project.imageUrl}`}
                              alt="Project"
                              className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                            />
                          </div>
                        )}

                        {/* Project Details */}
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800 mr-2">{project.title}</h3>
                            <span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                            <div>
                              <strong>Budget:</strong> ${project.budget}
                            </div>
                            <div>
                              <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewProject(project._id)}
                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-md transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;