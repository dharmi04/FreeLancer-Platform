import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle, FaApple } from "react-icons/fa";
import signupImage from "../../assets/Image1.jpg"; // Replace with actual image

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/register", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#9DBEBB] to-[#F4E9CD] items-center justify-center px-6 py-4">
      {/* Card Container */}
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl border border-white/30 bg-white/20 backdrop-blur-md overflow-hidden flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-gradient-to-b from-[#9DBEBB] to-[#F4E9CD] flex flex-col justify-center items-center">
  <h2 className="text-3xl font-bold text-[#031926] mb-2 text-center">Create an account</h2>
  <p className="text-[#468189] mb-6 text-center">Sign up and get a 30-day free trial</p>

          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#468189]" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#468189]" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#468189]" required />
            
            <div>
            {/* <label className="block mb-1 text-gray-600" htmlFor="role">
              Role
            </label> */}
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
            
            <button type="submit" className="w-full bg-[#F4E9CD] text-[#031926] py-2 rounded-md font-semibold hover:bg-[#77ACA2] transition">
              Submit
            </button>
          </form>
          

            <button className="flex w-full items-center gap-2 bg-white border px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 mt-4 text-center justify-center">
              <FaGoogle /> Google
            </button>
        
          
          {/* Login Link */}
          <p className="text-center text-sm mt-4 text-[#031926]">
            Already have an account? <span className="text-[#468189] cursor-pointer" onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center  p-6">
          <motion.img src={signupImage} alt="Signup" className="h-auto w-full max-w-xs rounded-lg shadow-lg" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
