import React, { useState } from "react";
import axios from "axios";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [projectImage, setProjectImage] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);
      formData.append("deadline", deadline);
      formData.append("category", category);
      // If you have questions, you can append them as well
      if (projectImage) {
        formData.append("projectImage", projectImage); // matches "upload.single('projectImage')"
      }

      const res = await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Project created!");
      console.log(res.data.project);
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Project</h2>

      <label className="block mb-1" htmlFor="title">
        Title
      </label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border mb-4 w-full p-2"
        required
      />

      <label className="block mb-1" htmlFor="description">
        Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border mb-4 w-full p-2"
        required
      />

      <label className="block mb-1" htmlFor="budget">
        Budget
      </label>
      <input
        id="budget"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="border mb-4 w-full p-2"
        required
      />

      <label className="block mb-1" htmlFor="deadline">
        Deadline
      </label>
      <input
        id="deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="border mb-4 w-full p-2"
        required
      />

      <label className="block mb-1" htmlFor="category">
        Category
      </label>
      <input
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border mb-4 w-full p-2"
      />

      {/* Project Image Upload */}
      <label className="block mb-1" htmlFor="projectImage">
        Project Image
      </label>
      <input
        id="projectImage"
        type="file"
        accept="image/*"
        onChange={(e) => setProjectImage(e.target.files[0])}
        className="border mb-4 w-full p-2"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Project
      </button>
    </form>
  );
};

export default AddProject;
