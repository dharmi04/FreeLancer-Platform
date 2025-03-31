import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Calendar, DollarSign, Tag, CheckCircle } from "lucide-react";
import FreeLancerNavBar from "./Components/FreeLancerNavBar";

const FreelancerProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [answers, setAnswers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user?.role !== "freelancer") {
      navigate("/login");
    } else {
      fetchProject();
    }
    // eslint-disable-next-line
  }, []);

  const fetchProject = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched project:", res.data);
      setProject(res.data);

      if (res.data.questions) {
        setAnswers(new Array(res.data.questions.length).fill(""));
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (resume) formData.append("resume", resume);

      // Debug: Log the structure of project.questions
      console.log("project.questions in handleApply:", project.questions);
      project.questions.forEach((q, i) => {
        console.log(`Question #${i}:`, q, "questionText:", q.questionText);
      });

      // Map over questions and use a fallback in case questionText is not set
      const formattedAnswers = project.questions.map((q, index) => ({
        questionText: q.question, // fallback to q if q.questionText is missing
        answerText: answers[index] || "",
      }));

      console.log("Formatted Answers:", JSON.stringify(formattedAnswers, null, 2));

      formData.append("answers", JSON.stringify(formattedAnswers));

      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Applied successfully!");
      navigate("/freelancer/dashboard");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!project)
    return <p className="text-center text-red-500 mt-10">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <FreeLancerNavBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Tag className="mr-3 text-blue-600" />
            Project Details
          </h1>
          <button
            onClick={() => navigate("/freelancer/projects")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition transform hover:-translate-y-1 hover:scale-105"
          >
            Back to Projects
          </button>
        </div>

        {/* Project Overview */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Image and Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {project.imageUrl && (
              <img
                src={`http://localhost:5000/${project.imageUrl}`}
                alt="Project"
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {project.title}
              </h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <DollarSign className="mr-3 text-green-600" />
                  <span className="font-semibold">Budget:</span>
                  <span className="ml-2">${project.budget}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-3 text-blue-600" />
                  <span className="font-semibold">Deadline:</span>
                  <span className="ml-2">
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="mr-3 text-green-500" />
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm ${
                      project.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Section */}
          {project.status === "open" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleApply}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="mr-3 text-blue-600" />
                  Apply to this Project
                </h3>

                {/* Questions Section */}
                {project.questions && project.questions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      Answer the following questions:
                    </h4>
                    {project.questions.map((q, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          {q.questionText}
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                          rows="3"
                          value={answers[index]}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Upload Resume (PDF)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setResume(e.target.files[0])}
                      className="w-full file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {resume && (
                      <p className="text-sm text-green-600 mt-2">
                        {resume.name} selected
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition transform hover:scale-105 shadow-md"
                >
                  Submit Application
                </button>
              </form>
            </div>
          )}
        </div>

        {project.status !== "open" && (
          <div className="text-center mt-8 bg-yellow-100 p-4 rounded-lg">
            <p className="text-yellow-800">
              This project is no longer open for applications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProjectDetails;
