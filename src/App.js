import Nav from './Components/Nav';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import CreateProject from './Components/CreateProject';
import Assignskill from './Components/Assignskill.jsx';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/LogOut" element={<h1>Log Out</h1>} />
      <Route path="/Profile" element={<h1>Profile</h1>} />
      <Route path="/assignskill" element={<Assignskill />} />

      <Route path="/create-project" element={<CreateProject />} />
    </Routes>
    </BrowserRouter>
    <Footer/>
    </div>
  )
}; 

export default App;