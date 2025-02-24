import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import CreateProject from './Components/CreateProject';
import Assignskill from './Components/Assignskill';
import ProjectDetails from './Components/ProjectDetails';

function App() {
  return (
    <BrowserRouter> {/* Ensure BrowserRouter wraps everything */}
      <div className="App">
        <Nav />  {/* Nav should be inside BrowserRouter */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/LogOut" element={<h1>Log Out</h1>} />
          <Route path="/Profile" element={<h1>Profile</h1>} />
          <Route path="/assignskill" element={<Assignskill />} />
          <Route path="/create-project" element={<CreateProject />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
