import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FreeLancerDashboard = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "freelancer") {
      // if not logged in or not a freelancer, redirect
      navigate("/login");
    } else {
      fetchMyApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
      categorizeApps(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      alert("Error fetching your applications.");
    } finally {
      setLoading(false);
    }
  };

  // Separate applications by status
  const categorizeApps = (apps) => {
    const pendingApps = apps.filter((item) => item.application.status === "pending");
    const acceptedApps = apps.filter((item) => item.application.status === "accepted");
    const rejectedApps = apps.filter((item) => item.application.status === "rejected");

    setPending(pendingApps);
    setAccepted(acceptedApps);
    setRejected(rejectedApps);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Pending Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Pending Applications</h2>
            {pending.length === 0 ? (
              <p>No pending applications.</p>
            ) : (
              <div className="space-y-4">
                {pending.map((item) => (
                  <div key={item.application._id} className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-1">{item.project.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Budget: ${item.project.budget} | Deadline:{" "}
                      {new Date(item.project.deadline).toLocaleDateString()}
                    </p>
                    {/* If there's an image */}
                    {item.project.imageUrl && (
                      <img
                        src={`http://localhost:5000/${item.project.imageUrl}`}
                        alt="Project"
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-gray-700">{item.project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status: {item.application.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Accepted / Ongoing Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Accepted / Ongoing</h2>
            {accepted.length === 0 ? (
              <p>No accepted projects yet.</p>
            ) : (
              <div className="space-y-4">
                {accepted.map((item) => (
                  <div key={item.application._id} className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-1">{item.project.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Budget: ${item.project.budget} | Deadline:{" "}
                      {new Date(item.project.deadline).toLocaleDateString()}
                    </p>
                    {item.project.imageUrl && (
                      <img
                        src={`http://localhost:5000/${item.project.imageUrl}`}
                        alt="Project"
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-gray-700">{item.project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status: {item.application.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Rejected Section */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Rejected</h2>
            {rejected.length === 0 ? (
              <p>No rejected applications.</p>
            ) : (
              <div className="space-y-4">
                {rejected.map((item) => (
                  <div key={item.application._id} className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-1">{item.project.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Budget: ${item.project.budget} | Deadline:{" "}
                      {new Date(item.project.deadline).toLocaleDateString()}
                    </p>
                    {item.project.imageUrl && (
                      <img
                        src={`http://localhost:5000/${item.project.imageUrl}`}
                        alt="Project"
                        className="w-full h-48 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-gray-700">{item.project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status: {item.application.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default FreeLancerDashboard;
