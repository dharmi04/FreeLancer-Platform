import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import loginImage from "../../assets/Image1.jpg"; // Replace with actual image

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");

      if (data.user.role === "freelancer") {
        navigate(data.user.profilePicture ? "/freelancer/dashboard" : "/freelancer/setup-profile");
      } else if (data.user.role === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#9DBEBB] to-[#F4E9CD] items-center justify-center px-6 py-4">
      {/* Card Container */}
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl border border-white/30 bg-white/20 backdrop-blur-md overflow-hidden flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-1/2 p-8 bg-gradient-to-b from-[#9DBEBB] to-[#F4E9CD] flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-[#031926] mb-2 text-center">Login</h2>
          <p className="text-[#468189] mb-6 text-center">Welcome back! Sign in to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#468189]" required />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#468189]" required />
            
            <button type="submit" className="w-full bg-[#F4E9CD] text-[#031926] py-2 rounded-md font-semibold hover:bg-[#77ACA2] transition">
              Login
            </button>
          </form>

          {/* <button className="flex w-full items-center gap-2 bg-white border px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 mt-4 text-center justify-center">
            <FaGoogle /> Sign in with Google
          </button> */}

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-4 text-[#031926]">
            Don't have an account? <span className="text-[#468189] cursor-pointer" onClick={() => navigate("/signup")}>Create account</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 hidden md:flex items-center justify-center p-6">
          <motion.img src={loginImage} alt="Login" className="h-auto w-full max-w-xs rounded-lg shadow-lg" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
