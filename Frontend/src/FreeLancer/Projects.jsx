// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api";
// import FreeLancerNavBar from "./Components/FreeLancerNavBar";
// import { FaSearch } from "react-icons/fa";
// import { IoFilterSharp } from "react-icons/io5";
// import { MdSort } from "react-icons/md";

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const response = await API.get("/projects");
//       setProjects(response.data);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch projects");
//     }
//   };

//   // Filter projects based on search term
//   const filteredProjects = projects.filter((project) =>
//     project.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#ffffff]">
//       <FreeLancerNavBar />

//       {/* Search Bar & Filters */}
//       <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F4E9CD] p-4 rounded-lg  shadow-md gap-4">
//         {/* Filter Button */}
//         <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition">
//           <IoFilterSharp className="text-[#031926]" />
//           <span className="text-[#031926] font-medium text-sm">Filter</span>
//         </button>

//         {/* Search Input */}
//         <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-[1500px] sm:max-w-lg">
//           <FaSearch className="text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search the creative world at work"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="ml-2 w-full focus:outline-none text-sm"
//           />
//         </div>

//         {/* Sort Button */}
//         <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition">
//           <MdSort className="text-[#031926]" />
//           <span className="text-[#031926] font-medium text-sm">Sort</span>
//         </button>
//       </div>

//       {/* Page Title */}
//       {/* <h1 className="text-2xl sm:text-3xl font-bold text-[#031926] text-center mt-6 mb-6">
//         Explore Exciting Projects
//       </h1> */}

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 pb-12 mt-10">
//         {filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             <div
//               key={project._id}
//               onClick={() => navigate(`/freelancer/projects/${project._id}`)}
//               className="cursor-pointer bg-white shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
//             >
//               {/* Project Image */}
//               {project.imageUrl && (
//                 <img
//                   src={`http://localhost:5000/${project.imageUrl}`}
//                   alt="Project"
//                   className="w-full h-52 object-cover"
//                 />
//               )}

//               {/* Project Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-[#031926]">{project.title}</h2>
//                 <p className="text-gray-500 text-sm">{project.description}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 col-span-full">
//             No projects found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Projects;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaProjectDiagram } from "react-icons/fa";
import API from "../api";
import FreeLancerNavBar from "./Components/FreeLancerNavBar";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get("/projects");
      
      // Debug: Log the entire response
      console.log("Full API Response:", response);
      
      // Check if response.data exists and is an array
      const projectsData = response.data || [];
      setProjects(projectsData);
      
      // Additional debugging
      console.log("Projects Fetched:", projectsData.length);
      console.log("First Project (if any):", projectsData[0]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FreeLancerNavBar />

      {/* Search Input */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/freelancer/projects/${project._id}`)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                {project.imageUrl && (
                  <img
                    src={`http://localhost:5000/${project.imageUrl}`}
                    alt="Project"
                    className="w-full h-52 object-cover"
                  />
                )}

                {/* Project Info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                  <p className="text-gray-500 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaProjectDiagram className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;