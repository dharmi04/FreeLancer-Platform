import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeftIcon, 
  MessageCircleIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  FileTextIcon, 
  CalendarIcon, 
  DollarSignIcon, 
  TagIcon, 
  DollarSign 
} from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "client") {
      navigate("/login");
    } else {
      fetchProjectDetails();
      fetchProjectUpdates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProject(res.data);
    } catch (error) {
      console.error("Failed to fetch project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectUpdates = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/updates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpdates(res.data.updates);
    } catch (error) {
      console.error("Failed to fetch project updates:", error);
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleApplicationStatus = async (applicationId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProject(res.data.project);
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
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

  // Application status color mapping
  const getApplicationStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Project not found or error occurred.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate("/client/dashboard")}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Project Details</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/client/dashboard")}
            className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Project Image */}
          <div className="md:col-span-1">
            {project.imageUrl ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-[400px]">
                <img
                  src={`http://localhost:5000/${project.imageUrl}`}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl shadow-md h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No project image</p>
              </div>
            )}
          </div>

          {/* Right Column - Project Details, Applications & Updates */}
          <div className="md:col-span-2 space-y-6">
            {/* Project Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{project.title}</h2>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <DollarSignIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Budget: ${project.budget}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <TagIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    Category: {project.category || "N/A"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>
            </div>

            {/* Applications Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Freelancer Applications</h3>
              {project.applications && project.applications.length > 0 ? (
                <div className="space-y-6">
                  {project.applications.map((app) => (
                    <div 
                      key={app._id} 
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-black">
                            {app.freelancer?.name}
                          </h4>
                          <p className="text-sm text-black">{app.freelancer?.email}</p>
                        </div>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {app.resumeUrl && (
                            <a
                              href={`http://localhost:5000/${app.resumeUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <FileTextIcon className="w-5 h-5 mr-2" />
                              View Resume
                            </a>
                          )}
                        </div>

                        {app.status === "pending" && (
                          <div className="space-x-3">
                            <button
                              onClick={() => handleApplicationStatus(app._id, "accepted")}
                              className="flex items-center bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle2Icon className="w-5 h-5 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(app._id, "rejected")}
                              className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <XCircleIcon className="w-5 h-5 mr-2" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      {app.status === "accepted" && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-2">
                          <button
                            onClick={() => navigate(`/discussion/${projectId}`)}
                            className="flex items-center bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <MessageCircleIcon className="w-5 h-5 mr-2" />
                            Discussion
                          </button>
                          <a
                            href="/payment"
                            className="flex items-center text-blue-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <DollarSign className="w-5 h-5 mr-2" />
                            Pay Fees
                          </a>
                        </div>
                      )}
                      {/* Answers to Questions */}
                      {app.answers && app.answers.length > 0 && (
                        <div className="mt-4 bg-white rounded-md p-4 border border-gray-100">
                          <h5 className="text-md font-semibold mb-2 text-gray-700">Screening Questions</h5>
                          <ul className="space-y-2">
                            {app.answers.map((answerObj, idx) => (
                              <li 
                                key={idx} 
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <span className="font-medium mr-2">•</span>
                                <div>
                                  <span className="font-semibold mr-2">{answerObj.questionText}:</span>
                                  {answerObj.answerText}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-lg">No applications received yet.</p>
                  <p className="text-sm">Freelancers will apply to your project soon.</p>
                </div>
              )}
            </div>

            {/* Project Updates Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Project Updates</h3>
              {updatesLoading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              ) : updates && updates.length > 0 ? (
                <ul className="space-y-4">
                  {updates.map((update, idx) => (
                    <li key={idx} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold">Progress: {update.progress}%</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{update.note}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No updates available for this project.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
