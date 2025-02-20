import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FreelancerProfileSetup = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // If user is not freelancer or not logged in, redirect
    if (!token || user?.role !== "freelancer") {
      navigate("/login");
    }
  }, [navigate, token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile setup completed!");
      // Update localStorage with updated user data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Now that we have a profile picture, go to freelancer dashboard
      navigate("/freelancer/dashboard");
    } catch (error) {
      console.error("Error setting up profile:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Setup Your Freelancer Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Bio (optional)</label>
          <textarea
            className="border p-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default FreelancerProfileSetup;
