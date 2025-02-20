 import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom" 
import Login from "./Pages/Auth/Login"
import SignUp from "./Pages/Auth/SignUp"
import Home from "./Pages/Home"
import './index.css'
import Projects from "./FreeLancer/Projects"
import Dashboard from "./Client/Dashboard"
import FreeLancerDashboard from "./FreeLancer/FreeLancerDashboard"
import ProjectDetails from "./Client/ProjectDetails"
import AddProject from "./Client/AddProject"
import FreelancerProjectDetails from "./FreeLancer/FreelancerProjectDetails"
import FreeLancerprofile from "./FreeLancer/FreeLancerprofile"
import FreelancerProfileSetup from "./FreeLancer/FreeLancerProfileSetup"
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/signup" exact element={<SignUp />}></Route>
          <Route path="/freelancer/projects" element={<Projects />} />

          {/* Dashboards */}
        <Route path="/client/dashboard" element={<Dashboard />} />
        <Route path="/freelancer/dashboard" element={<FreeLancerDashboard />} />
        <Route path="/freelancer/profile" element={<FreeLancerprofile/>} />
        <Route path="/freelancer/setup-profile" element={<FreelancerProfileSetup />} />
        <Route path="/client/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/client/AddProject" element={<AddProject />} />

        {/* Freelancer routes */}
        <Route path="/freelancer/projects/:projectId" element={<FreelancerProjectDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
