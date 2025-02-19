import React from 'react'

const FreeLancerDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Freelancer Dashboard</h1>
        <p>Welcome, {user?.name}. This is your freelancer dashboard!</p>
        {/* Show available projects, etc. */}
      </div>
    );
  };

export default FreeLancerDashboard
