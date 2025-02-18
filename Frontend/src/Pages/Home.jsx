import React from 'react'

const Home = () => {
  return (
    <div>
       <div className="bg-blue-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="text-xl font-bold">YourLogo</div>
        <a href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Sign Up
        </a>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to SkillSync
        </h1>
        <p className="text-xl md:text-2xl mb-8">
       Effortless and seamless synchronization of highly skilled talent with outstanding opportunities, ensuring that both freelancers and clients can connect and collaborate like never before.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium">
          Get Started
        </button>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-10 px-4 text-center text-blue-700">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="max-w-3xl mx-auto">
          We are a passionate team dedicated to bridging the gap between freelancers
          and businesses, providing a seamless experience for real-time collaboration.
          Whether you are a designer, developer, or content creator, our platform
          makes it easy to connect with clients across the globe.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-4 bg-white text-blue-900 text-center">
        <h2 className="text-3xl font-semibold mb-6">Happy Clients & Freelancers</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-blue-900 p-4 rounded shadow">
            <p>
              "Amazing platform! I found the perfect freelancer for my project and
              collaborated in real-time without any hassle."
            </p>
            <h4 className="mt-2 font-semibold">- Jane, Client</h4>
          </div>
          <div className="bg-white text-blue-900 p-4 rounded shadow">
            <p>
              "The real-time features have revolutionized how I work with clients.
              No more endless email chains!"
            </p>
            <h4 className="mt-2 font-semibold">- Alex, Freelancer</h4>
          </div>
          <div className="bg-white text-blue-900 p-4 rounded shadow">
            <p>
              "Great community, awesome support, and a smooth payment process.
              Highly recommended!"
            </p>
            <h4 className="mt-2 font-semibold">- Sam, Client</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-center py-4">
        <p>&copy; 2025 YourPlatform. All rights reserved.</p>
      </footer>
    </div>
    </div>
  )
}

export default Home
