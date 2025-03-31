import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Camera, PlusCircle, Trash2, Save } from "lucide-react";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [questions, setQuestions] = useState([""]); 
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProjectImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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
      formData.append("questions", JSON.stringify(questions.filter(q => q.trim() !== "")));

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-3xl"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
            <PlusCircle className="w-8 h-8" />
            Create New Project
          </h2>
        </div>

        <div className="p-8 space-y-6">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Project Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 group">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Project Preview" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-12 h-12 text-gray-400 mb-3 group-hover:text-blue-500 transition" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
                required 
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
                required 
                placeholder="Project category"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 h-32" 
              required 
              placeholder="Describe your project in detail"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Budget</label>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
                required 
                placeholder="Project budget"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Deadline</label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
                required 
              />
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">Project Questions</label>
            {questions.map((question, index) => (
              <div key={index} className="flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder={`Question ${index + 1}`}
                />
                {questions.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(index)} 
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addQuestion} 
              className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 transition duration-300"
            >
              <PlusCircle className="w-5 h-5" />
              Add Another Question
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Save className="w-6 h-6" />
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;