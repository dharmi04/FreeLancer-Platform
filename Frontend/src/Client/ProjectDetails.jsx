import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClientNavBar from "./Components/ClientNavBar";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "client") {
      navigate("/login");
    } else {
      fetchProjectDetails();
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

  // Handle accept/reject application
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
      // Update the local state with the updated project data
      setProject(res.data.project);
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found or error occurred.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ClientNavBar />
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Project Details</h1>
        <button
          onClick={() => navigate("/client/dashboard")}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Project Info */}
      <main className="p-6">
        <div className="bg-white rounded shadow p-4 mb-6">
            {/* Project Image */}
            {project.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={`http://localhost:5000/${project.imageUrl}`}
                          alt="Project"
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}

          <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
          <p className="text-gray-700 mb-1">{project.description}</p>
          <p className="text-sm text-gray-500 mb-1">Budget: ${project.budget}</p>
          <p className="text-sm text-gray-500 mb-1">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mb-1">Status: {project.status}</p>
          <p className="text-sm text-gray-500">
            Category: {project.category || "N/A"}
          </p>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-bold mb-4">Freelancer Applications</h3>
          {project.applications && project.applications.length > 0 ? (
            <div className="space-y-4">
              {project.applications.map((app) => (
                <div key={app._id} className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Freelancer: {app.freelancer?.name} ({app.freelancer?.email})
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {app.status}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApplicationStatus(app._id, "accepted")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(app._id, "rejected")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Resume Link (if any) */}
                  {app.resumeUrl && (
  <p className="mt-2">
    Resume:{" "}
    <a
      href={`http://localhost:5000/${app.resumeUrl}`}  // <-- Use the backend's port
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      View
    </a>
  </p>
)}

                  {/* Answers to Questions */}
                  {app.answers && app.answers.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold mb-1">Answers:</h4>
                      <ul className="list-disc list-inside">
                        {app.answers.map((answerObj, idx) => (
                          <li key={idx}>
                            <strong>{answerObj.questionText}:</strong>{" "}
                            {answerObj.answerText}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No applications yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
