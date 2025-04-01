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
import DiscussionThread from "./Components/DiscussionThread"
import UserProfile from "./Pages/UserProfile"
import Tweet from "./Tweet/Tweet"
import CreateTweet from "./Tweet/CreateTweet"
import TweetsFeed from "./Tweet/TweetsFeed"
import UserTweet from "./Tweet/UserTweet"
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
        <Route path="/freelancer/my-profile" element={<FreelancerProfileSetup />} />
        <Route path="/client/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/client/AddProject" element={<AddProject />} />
        <Route path="/profile" element={<UserProfile />} /> {/* Current user's profile */}
        <Route path="/profile/:id" element={<UserProfile />} /> 
        {/* Freelancer routes */}
        <Route path="/freelancer/projects/:projectId" element={<FreelancerProjectDetails />} />

        <Route path="/discussion/:projectId" element={<DiscussionThread />} />
        {/* <Route path="/client/:clientId" element={<ClientProfile/>} /> */}
        <Route path="/all-tweet" element={<TweetsFeed />} />
        <Route path="/create-tweet" element={<CreateTweet />} />
        <Route path="/user-tweet/:username" element={<UserTweet />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
