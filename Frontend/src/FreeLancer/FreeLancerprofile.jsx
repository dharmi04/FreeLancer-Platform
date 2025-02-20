import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Freelancerprofile = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || user?.role !== "freelancer") {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      // We assume /api/users/me returns the user's doc
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setBio(res.data.bio || "");
      setPortfolioProjects(res.data.portfolioProjects || []);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleAddPortfolio = () => {
    setPortfolioProjects([...portfolioProjects, { title: "", link: "" }]);
  };

  const handlePortfolioChange = (index, field, value) => {
    const updated = [...portfolioProjects];
    updated[index][field] = value;
    setPortfolioProjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("portfolioProjects", JSON.stringify(portfolioProjects));
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await axios.put("http://localhost:5000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated!");
      setUserData(res.data.user); // updated user data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Freelancer Profile</h1>

      {userData && userData.profilePicture && (
        <img
          src={`http://localhost:5000/${userData.profilePicture}`}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Bio</label>
          <textarea
            className="border p-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Portfolio Projects</label>
          {portfolioProjects.map((proj, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) => handlePortfolioChange(index, "title", e.target.value)}
                className="border p-1 w-full mb-1"
              />
              <input
                type="text"
                placeholder="Project Link"
                value={proj.link}
                onChange={(e) => handlePortfolioChange(index, "link", e.target.value)}
                className="border p-1 w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPortfolio}
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
            + Add Project
          </button>
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

export default Freelancerprofile;
