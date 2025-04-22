import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from './Components/AuthContext.js';
import Nav from "./Components/Nav";
import Home from "./Components/Home";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import CreateProject from "./Components/CreateProject";
import Assignskill from "./Components/Assignskill";
import ProjectDetails from "./Components/ProjectDetails";
import AssignPersonalityTraits from './Components/AssignPersonalities.js'

function App() {
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Retrieved userId from localStorage:", storedUserId);  // DEBUGGING
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <AuthProvider> 
    <BrowserRouter >
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login setUser={setUserId} />} />
          <Route path="/LogOut" element={<h1>Log Out</h1>} />
          <Route path="/Profile" element={<h1>Profile</h1>} />
          <Route path="/assignskill" element={<Assignskill />} />
          <Route path="/assignpersonalitytraits" element={<AssignPersonalityTraits />} />          
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectDetails userId={userId} />} />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider> 

  );
}

export default App;
