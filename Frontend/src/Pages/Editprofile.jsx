import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePicture: null,
    bio: "",
    portfolioProjects: []
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [navigate, token, user]);

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Set initial form data from response
        setFormData({
          bio: response.data.bio || "",
          profilePicture: null, // Can't set file directly
          portfolioProjects: response.data.portfolioProjects?.length > 0 
            ? response.data.portfolioProjects 
            : [{ title: "", link: "" }]
        });
        
        // Set preview URL for existing profile picture
        if (response.data.profilePicture) {
          setPreviewUrl(`http://localhost:5000/${response.data.profilePicture}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load your profile data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [token]);

  // Handle image preview
  useEffect(() => {
    if (!formData.profilePicture) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(formData.profilePicture);
  }, [formData.profilePicture]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.portfolioProjects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData({ ...formData, portfolioProjects: updatedProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      portfolioProjects: [...formData.portfolioProjects, { title: "", link: "" }]
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.portfolioProjects.filter((_, i) => i !== index);
    setFormData({ ...formData, portfolioProjects: updatedProjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append("bio", formData.bio);
      
      if (formData.profilePicture) {
        submitData.append("profilePicture", formData.profilePicture);
      }
      
      // Add portfolio projects
      submitData.append("portfolioProjects", JSON.stringify(formData.portfolioProjects));

      const res = await axios.put("http://localhost:5000/api/users/profile", submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update localStorage with updated user data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Success notification
      alert("Profile updated successfully!");
      
      // Navigate to profile view
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Your Profile</h1>
            <p className="text-blue-100 mt-1">Update your profile information</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-500">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep your current profile picture
                  </p>
                </div>
              </div>
              
              {/* Bio Section */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Write a compelling bio that highlights your expertise and experience..."
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Briefly describe your skills, experience, and what makes you unique</p>
              </div>
              
              {/* Portfolio Projects Section (only show for freelancers) */}
              {user.role === 'freelancer' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Portfolio Projects
                    </label>
                    <button
                      type="button"
                      onClick={addProject}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Project
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.portfolioProjects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md relative">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Project Title
                            </label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                              placeholder="E-commerce Website"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Project Link
                            </label>
                            <input
                              type="url"
                              value={project.link}
                              onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                              placeholder="https://github.com/yourusername/project"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {formData.portfolioProjects.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No projects added yet.</p>
                  )}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;