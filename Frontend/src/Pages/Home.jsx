import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, Globe, Star, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import heroBackground from '../assets/HeroImage.jpg'; // Make sure this path is correct

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="SkillSync Logo" className="h-12 mr-2" />
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/find-projects" className="hover:text-blue-600 transition font-medium">Find Projects</Link>
            <Link to="/find-freelancers" className="hover:text-blue-600 transition font-medium">Find Freelancers</Link>
            <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md">Login</Link>
            <Link to="/signup" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition shadow-sm">Sign Up</Link>
          </div>
          {/* Mobile menu button can be added here */}
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <header 
        className="relative bg-cover bg-center h-screen flex items-center"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-fade-in">
            Find Your Perfect Freelance Project or Talent
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white opacity-90">
            Connect with top freelancers or find exciting projects across various domains
          </p>
          
          {/* Search Bar */}
          {/* <div className="max-w-3xl mx-auto flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <Search className="ml-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search projects, skills, or freelancers"
              className="w-full p-4 outline-none text-gray-700"
            />
            <button className="bg-blue-500 text-white px-6 py-4 hover:bg-blue-600 transition-colors font-medium">
              Search
            </button>
          </div> */}

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              I'm a Client <ArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              I'm a Freelancer <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">About SkillSync</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're transforming the way freelancers and clients connect, making professional collaboration seamless and efficient.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Globe className="mx-auto mb-4 text-blue-500" size={64} />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Global Reach</h3>
            <p className="text-gray-600">Connect with talent and opportunities from around the world.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Verified Profiles</h3>
            <p className="text-gray-600">Every profile is verified to ensure quality and trust.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Star className="mx-auto mb-4 text-yellow-500" size={64} />
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Easy Collaboration</h3>
            <p className="text-gray-600">Intuitive platform designed for smooth project management.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose SkillSync?</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide unique features that set us apart from other freelancing platforms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Transparent Pricing</h3>
              <p className="text-gray-700">No hidden fees. Clear, upfront pricing for both clients and freelancers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Secure Payments</h3>
              <p className="text-gray-700">Guaranteed payment protection and multiple secure payment methods.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-yellow-500">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">Smart Matching</h3>
              <p className="text-gray-700">AI-powered algorithm to match projects with the most suitable freelancers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-purple-500">
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
            <div className="flex items-center mb-4">
              <img src={logo} alt="SkillSync Logo" className="h-10 mr-2 bg-white p-1 rounded" />
              <h4 className="text-2xl font-bold">SkillSync</h4>
            </div>
            <p className="text-gray-400">Connecting talents with opportunities worldwide.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/find-projects" className="hover:text-blue-400 transition-colors">Find Projects</Link></li>
              <li><Link to="/find-freelancers" className="hover:text-blue-400 transition-colors">Find Freelancers</Link></li>
              <li><Link to="/how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg border-b border-gray-700 pb-2">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg border-b border-gray-700 pb-2">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500">
          © 2025 SkillSync. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;