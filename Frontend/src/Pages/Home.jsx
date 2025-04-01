// import React from 'react';
// import { motion } from 'framer-motion';
// import heroImage from '../assets/HeroImage.jpg';

// const Home = () => {
//   return (
//     <div className="bg-[#F4E9CD] min-h-screen font-sans">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
//         <div className="text-2xl font-bold text-[#031926]">SkillSync</div>
//         <a href="/signup" className="bg-[#468189] hover:bg-[#77ACA2] text-white px-4 py-2 rounded shadow-md">
//           Sign Up
//         </a>
//       </nav>

//       {/* Hero Section */}
//       <section 
//         className="relative flex flex-col items-center justify-center text-center text-white px-4 py-20 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImage})` }}>
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         <motion.div 
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="relative z-10 max-w-3xl">
//           <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
//             Empower Your Freelance Journey
//           </h1>
//           <p className="text-lg md:text-xl mb-6 drop-shadow-md">
//             Connecting skilled professionals with top-tier clients in real-time, making collaboration effortless.
//           </p>
//           <motion.button 
//             whileHover={{ scale: 1.1 }}
//             className="bg-[#468189] hover:bg-[#77ACA2] text-white px-6 py-3 rounded-lg shadow-lg font-medium">
//             Get Started
//           </motion.button>
//         </motion.div>
//       </section>

//       {/* About Us Section */}
//       <section className="py-16 px-6 text-center text-[#031926]">
//         <h2 className="text-4xl font-semibold mb-6">About Us</h2>
//         <p className="max-w-3xl mx-auto text-lg">
//           SkillSync is dedicated to bridging the gap between freelancers and businesses. Whether you are a designer, developer, or content creator, our platform ensures real-time collaboration with ease.
//         </p>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 px-6 bg-[#9DBEBB] text-[#031926] text-center">
//         <h2 className="text-4xl font-semibold mb-8">Why Choose Us?</h2>
//         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//           <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold">Real-Time Collaboration</h3>
//             <p>Engage with clients and freelancers instantly with our seamless communication tools.</p>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold">Secure Payments</h3>
//             <p>Safe transactions with milestone-based payment systems.</p>
//           </motion.div>
//           <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold">Global Community</h3>
//             <p>Work with professionals across the globe without any barriers.</p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-[#031926] text-white text-center py-6">
//         <p>&copy; 2025 SkillSync. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;





import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, Globe, Star, ArrowRight } from 'lucide-react';
import image from '../assets/logo.png'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">SkillSync</div>
          {/* <img src={image} className='w-40 h-30' /> */}
          <div className="flex space-x-6 items-center">
            <Link to="/find-projects" className="hover:text-blue-600 transition text-sm md:text-lg">Find Projects</Link>
            <Link to="/find-freelancers" className="hover:text-blue-600 transition">Find Freelancers</Link>
            <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Login</Link>
            <Link to="/signup" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Find Your Perfect Freelance Project or Talent
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Connect with top freelancers or find exciting projects across various domains
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <Search className="ml-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search projects, skills, or freelancers"
              className="w-full p-4 outline-none text-gray-700"
            />
            <button className="bg-blue-500 text-white px-6 py-4 hover:bg-blue-600 transition">
              Search
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex justify-center space-x-6">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition flex items-center"
            >
              I'm a Client <ArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-3 border border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition flex items-center"
            >
              I'm a Freelancer <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About SkillSync</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're transforming the way freelancers and clients connect, making professional collaboration seamless and efficient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <Globe className="mx-auto mb-4 text-blue-500" size={64} />
            <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
            <p className="text-gray-600">Connect with talent and opportunities from around the world.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h3 className="text-xl font-semibold mb-4">Verified Profiles</h3>
            <p className="text-gray-600">Every profile is verified to ensure quality and trust.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition">
            <Star className="mx-auto mb-4 text-yellow-500" size={64} />
            <h3 className="text-xl font-semibold mb-4">Easy Collaboration</h3>
            <p className="text-gray-600">Intuitive platform designed for smooth project management.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkillSync?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide unique features that set us apart from other freelancing platforms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Transparent Pricing</h3>
              <p className="text-gray-700">No hidden fees. Clear, upfront pricing for both clients and freelancers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Secure Payments</h3>
              <p className="text-gray-700">Guaranteed payment protection and multiple secure payment methods.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Smart Matching</h3>
              <p className="text-gray-700">AI-powered algorithm to match projects with the most suitable freelancers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">24/7 Support</h3>
              <p className="text-gray-700">Dedicated support team available round the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            
            <h4 className="text-2xl font-bold mb-4">SkillSync</h4>
            <p className="text-gray-400">Connecting talents with opportunities worldwide.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/find-projects" className="hover:text-blue-400">Find Projects</Link></li>
              <li><Link to="/find-freelancers" className="hover:text-blue-400">Find Freelancers</Link></li>
              <li><Link to="/how-it-works" className="hover:text-blue-400">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Social media icons can be added here */}
              <a href="#" className="hover:text-blue-400">Twitter</a>
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          © 2024 SkillSync. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;