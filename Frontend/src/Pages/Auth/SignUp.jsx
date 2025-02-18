// SignUp.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client", // or "freelancer"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      alert(response.data.message); 
      // After successful signup, redirect to Login
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center bg-blue-800 text-white p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">YourPlatformName</h1>
          <p className="text-lg">
            A seamless platform for real-time collaboration.
          </p>
        </div>
      </div>

      {/* Right Section: Sign Up Form */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Sign Up</h2>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600" htmlFor="role">
              Role
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
