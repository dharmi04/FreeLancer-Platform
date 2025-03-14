import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  }, []);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(res.data);
      // Initialize answers array based on the number of questions
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
      
      const formattedAnswers = project.questions.map((q, index) => ({
        questionText: q.questionText, 
        answerText: answers[index]?.answerText || "",
      }));
  
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
      // ✅ Redirect to freelancer dashboard
      navigate("/freelancer/dashboard");
    } catch (error) {
      console.error("Failed to apply:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <FreeLancerNavBar />
      <header className="flex justify-between items-center mb-4 p-6">
        <h1 className="text-xl font-bold">Project Details</h1>
        <button
          onClick={() => navigate("/freelancer/projects")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back
        </button>
      </header>

      <div className="bg-white rounded shadow mb-6 p-6">
        {project.imageUrl && (
          <img
            src={`http://localhost:5000/${project.imageUrl}`}
            alt="Project"
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
        <p className="text-gray-700 mb-1">{project.description}</p>
        <p className="text-gray-500 mb-1">Budget: ${project.budget}</p>
        <p className="text-gray-500 mb-1">
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </p>
        <p className="text-gray-500">Status: {project.status}</p>
      </div>

      {project.status === "open" && (
        <form onSubmit={handleApply} className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Apply to this Project</h3>

          {/* Render Questions */}
          {project.questions && project.questions.map((q, index) => (
  <div key={index} className="mb-2">
    <label className="block mb-1">{q.questionText}</label>
    <input
      type="text"
      className="border p-2 w-full"
      onChange={(e) => {
        const newAnswers = [...answers];
        newAnswers[index] = { questionId: q._id, answerText: e.target.value };
        setAnswers(newAnswers);
      }}
    />
  </div>
))}


          {/* Resume Upload */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Application
          </button>
        </form>
      )}

      {project.status !== "open" && <p className="text-gray-700">This project is no longer open for applications.</p>}
    </div>
  );
};

export default FreelancerProjectDetails;
