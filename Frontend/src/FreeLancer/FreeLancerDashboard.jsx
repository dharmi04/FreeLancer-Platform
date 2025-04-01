// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FreeLancerDashboard = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token || user?.role !== "freelancer") {
//       navigate("/login");
//     } else {
//       fetchFreelancerProjects();
//     }
//   }, []);

//   const fetchFreelancerProjects = async () => {
//     if (!user?._id) {
//       console.error("User ID is missing. Cannot fetch projects.");
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/projects/by-freelancer/${user._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Fetched Projects:", res.data); // Debugging log

//       // Sort: "In Progress" projects at the top
//       const sortedProjects = res.data.sort((a, b) => {
//         const statusA = a.status.toLowerCase();
//         const statusB = b.status.toLowerCase();

//         if (statusA === "in progress" && statusB !== "in progress") return -1;
//         if (statusA !== "in progress" && statusB === "in progress") return 1;
//         return 0;
//       });

//       setProjects(sortedProjects);
//     } catch (error) {
//       console.error("Failed to fetch projects:", error);
//       alert("Error fetching your projects.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateProgress = async (projectId) => {
//     const progress = prompt("Enter progress update (e.g., '50% Completed')");
//     if (!progress) return;

//     try {
//       await axios.put(
//         `http://localhost:5000/api/projects/${projectId}/update-progress`,
//         { progress },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Progress updated successfully!");
//       fetchFreelancerProjects(); // Refresh the project list
//     } catch (error) {
//       console.error("Failed to update progress:", error);
//       alert("Error updating progress.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
//         <h2 className="text-2xl font-bold mb-6 text-center">SkillSync</h2>
//         <nav className="flex flex-col gap-4">
//           <button
//             onClick={() => navigate("/freelancer/projects")}
//             className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
//           >
//             Explore Projects
//           </button>
//           <button
//             onClick={() => navigate("/my-jobs")}
//             className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
//           >
//             Jobs
//           </button>
//         </nav>
//         <div className="mt-auto">
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-600 hover:bg-red-500 py-2 mt-6 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-100 p-6">
//         <header className="mb-6 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
//           <span className="text-gray-700">Hello, {user?.name}</span>
//         </header>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <>
//             {/* Freelancer Applied Projects */}
//             <section>
//               <h2 className="text-xl font-semibold mb-2">Projects You've Applied For</h2>
//               {projects.length === 0 ? (
//                 <p>No applied projects.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {projects.map((project) => (
//                     <div
//                       key={project._id}
//                       className="bg-white p-4 rounded shadow flex justify-between items-center"
//                     >
//                       {/* Left Side - Project Info */}
//                       <div>
//                         <h3 className="text-lg font-bold">{project.title}</h3>
//                         <p className="text-gray-600">Budget: ${project.budget}</p>
//                         <p className="text-gray-500">
//                           Client: {project.client.name} ({project.client.email})
//                         </p>
//                         <p className="text-gray-600">Progress: {project.progress || "Not Updated"}</p>
//                       </div>

//                       {/* Right Side - Status & Update Progress Button */}
//                       <div className="flex items-center gap-4">
//                         <span
//                           className={`px-3 py-1 rounded text-white ${
//                             project.status.toLowerCase() === "accepted"
//                               ? "bg-green-500"
//                               : project.status.toLowerCase() === "rejected"
//                               ? "bg-red-500"
//                               : project.status.toLowerCase() === "in progress"
//                               ? "bg-yellow-500"
//                               : "bg-blue-500"
//                           }`}
//                         >
//                           {project.status}
//                         </span>

//                         {/* Show update progress button only if project is In Progress */}
//                         {project.status.toLowerCase() === "in progress" && (
//                           <button
//                             className="bg-blue-600 text-white px-3 py-1 rounded"
//                             onClick={() => navigate(`/discussion/${project._id}`)}
//                             // onClick={() => handleUpdateProgress(project._id)}
//                           >
//                             Go to Discussion
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default FreeLancerDashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { 
  Briefcase, 
  LogOut, 
  Grid, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search, 
  User,
  Edit 
} from 'lucide-react';

const ProgressUpdateModal = ({ isOpen, onClose, projectId, onSubmit }) => {
  const [progress, setProgress] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/update`, 
        { progress, note },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      onSubmit(response.data.project);
      onClose();
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Error updating project progress");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Project Progress</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Progress</label>
            <select 
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Progress</option>
              <option value="25">25% Complete</option>
              <option value="50">50% Complete</option>
              <option value="75">75% Complete</option>
              <option value="100">100% Complete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Note</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Provide a brief update about the project..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FreeLancerDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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

      const sortedProjects = res.data.sort((a, b) => {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();

        if (statusA === "in progress" && statusB !== "in progress") return -1;
        if (statusA !== "in progress" && statusB === "in progress") return 1;
        return 0;
      });

      setProjects(sortedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      alert("Error fetching your projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (project) => {
    setSelectedProject(project);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedProject(null);
    setIsUpdateModalOpen(false);
  };

  const handleUpdateProject = (updatedProject) => {
    const updatedProjects = projects.map(project => 
      project._id === updatedProject._id ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'in progress': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Existing Sidebar and other code remains the same */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <Briefcase className="mr-2 text-blue-400" size={32} />
          <h2 className="text-2xl font-bold text-white">SkillSync</h2>
        </div>
        
        <nav className="space-y-4 flex-grow">
          <button
            onClick={() => navigate("/freelancer/projects")}
            className="w-full flex items-center px-4 py-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Grid className="mr-3" size={20} />
            Explore Projects
          </button>
          <button
            onClick={() => navigate("/create-tweet")}
            className="w-full flex items-center px-4 py-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Briefcase className="mr-3" size={20} />
            Tweet
          </button>
          <button
            onClick={() => navigate("/freelancer/my-profile")}
            className="w-full flex items-center px-4 py-3 bg-gray-800 hover:bg-blue-600 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Briefcase className="mr-3" size={20} />
            Profile Setup
          </button>
        </nav>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 py-3 rounded-lg transition duration-300 ease-in-out"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </aside>
      
      {/* Main Content Section */}
      <main className="flex-1 p-8">
        {/* Previous header code remains the same */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="mr-3 text-blue-500" size={32} />
              Freelancer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>

          </div>
          
          {/* Search Bar */}
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Search your projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Your Applied Projects
            </h2>
            
            {filteredProjects.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No projects found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-1 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out border-l-4 hover:border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {project.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center">
                            <Clock className="mr-2 text-blue-500" size={16} />
                            Budget: ${project.budget}
                          </p>
                          {/* <p className="flex items-center">
                            <User className="mr-2 text-black" size={16} />
                            Client: {project?.client?.name || 'Unknown'}
                          </p> */}
                          {/* <p className="flex items-center">
                            <CheckCircle className="mr-2 text-purple-500" size={16} />
                            Progress: {project.progress || "Not Updated"}
                          </p> */}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-semibold uppercase ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                        
                        {project.status.toLowerCase() === "in progress" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/discussion/${project._id}`)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              Discussion
                            </button>
                            <button
                              onClick={() => handleOpenUpdateModal(project)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                            >
                              <Edit className="mr-2" size={16} />
                              Update Progress
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Progress Update Modal */}
      <ProgressUpdateModal 
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        projectId={selectedProject?._id}
        onSubmit={handleUpdateProject}
      />
    </div>
  );
};

export default FreeLancerDashboard;