 import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom" 
import Login from "./Pages/Auth/Login"
import SignUp from "./Pages/Auth/SignUp"
import Home from "./Pages/Home"
import './index.css'
import Projects from "./Pages/Projects"
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/signup" exact element={<SignUp />}></Route>
          <Route path="/projects" element={<Projects />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
