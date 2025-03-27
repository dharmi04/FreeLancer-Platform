import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [questions, setQuestions] = useState([""]); // Ensure it's always an array

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Handle input change for questions
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  // Add a new question input
  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);
      formData.append("deadline", deadline);
      formData.append("category", category);
      formData.append("questions", JSON.stringify(questions.filter(q => q.trim() !== ""))); // Filter empty

      if (projectImage) {
        formData.append("projectImage", projectImage);
      }

      const res = await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Project created successfully!");
      navigate("/client/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add Project</h2>

      {/* Title */}
      <label className="block mb-1 font-semibold">Title</label>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="border w-full p-2 mb-3 rounded" 
        required 
      />

      {/* Description */}
      <label className="block mb-1 font-semibold">Description</label>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="border w-full p-2 mb-3 rounded" 
        required 
      />

      {/* Budget */}
      <label className="block mb-1 font-semibold">Budget</label>
      <input 
        type="number" 
        value={budget} 
        onChange={(e) => setBudget(e.target.value)} 
        className="border w-full p-2 mb-3 rounded" 
        required 
      />

      {/* Deadline */}
      <label className="block mb-1 font-semibold">Deadline</label>
      <input 
        type="date" 
        value={deadline} 
        onChange={(e) => setDeadline(e.target.value)} 
        className="border w-full p-2 mb-3 rounded" 
        required 
      />

      {/* Category */}
      <label className="block mb-1 font-semibold">Category</label>
      <input 
        type="text" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        className="border w-full p-2 mb-3 rounded" 
        required 
      />

      {/* Questions */}
      <div>
        <h3 className="text-lg font-bold mb-2">Project Questions</h3>
        {questions.map((question, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="border p-2 w-full rounded"
              placeholder={`Question ${index + 1}`}
            />
            {questions.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeQuestion(index)} 
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ✖
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="bg-green-500 text-white px-3 py-1 rounded">
          + Add Question
        </button>
      </div>

      {/* Project Image */}
      <label className="block mt-3 mb-1 font-semibold">Upload Project Image</label>
      <input 
        type="file" 
        onChange={(e) => setProjectImage(e.target.files[0])} 
        className="border w-full p-2 mb-3 rounded" 
      />

      {/* Submit Button */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-3">
        Create Project
      </button>
    </form>
  );
};

export default AddProject;
