import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/HeroImage.jpg';

const Home = () => {
  return (
    <div className="bg-[#F4E9CD] min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-[#031926]">SkillSync</div>
        <a href="/signup" className="bg-[#468189] hover:bg-[#77ACA2] text-white px-4 py-2 rounded shadow-md">
          Sign Up
        </a>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative flex flex-col items-center justify-center text-center text-white px-4 py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Empower Your Freelance Journey
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            Connecting skilled professionals with top-tier clients in real-time, making collaboration effortless.
          </p>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="bg-[#468189] hover:bg-[#77ACA2] text-white px-6 py-3 rounded-lg shadow-lg font-medium">
            Get Started
          </motion.button>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-6 text-center text-[#031926]">
        <h2 className="text-4xl font-semibold mb-6">About Us</h2>
        <p className="max-w-3xl mx-auto text-lg">
          SkillSync is dedicated to bridging the gap between freelancers and businesses. Whether you are a designer, developer, or content creator, our platform ensures real-time collaboration with ease.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#9DBEBB] text-[#031926] text-center">
        <h2 className="text-4xl font-semibold mb-8">Why Choose Us?</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Real-Time Collaboration</h3>
            <p>Engage with clients and freelancers instantly with our seamless communication tools.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Secure Payments</h3>
            <p>Safe transactions with milestone-based payment systems.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Global Community</h3>
            <p>Work with professionals across the globe without any barriers.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#031926] text-white text-center py-6">
        <p>&copy; 2025 SkillSync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
