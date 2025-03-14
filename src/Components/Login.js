import React, { useState } from 'react';
import './LogIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    const url = "https://backend-server-d9vj.onrender.com";
    e.preventDefault();
  
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
  
    try {
      const response = await axios.post(url + "/login", { email, password });
      console.log("Login Response:", response.data); // Debugging
  
      if (response.data.loginStatus) {
        localStorage.setItem("userId", response.data.userId); // Store userId (which is empID)
        localStorage.setItem("token", response.data.token);
        setUser(response.data.userId); // Set state
  
        console.log("Saved userId (empID):", response.data.userId);
        navigate("/dashboard");
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred during login.");
    }
  };

  

  /* FIXME: Trying different try function to fetch user ID for chat
  const handleSubmit = async (e) => {
    const url = "http://localhost:3030";

    e.preventDefault();
        // Email validation
    // Check valid email input
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return; // Stop the function if the email is invalid
    };

    

    
    try {
      const response = await axios.post(url +'/login', { email, password });
      console.log(response);

      if (response.data.loginStatus && response.data.Admin) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else if (response.data.loginStatus) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred during login.');
    }
      
  };
*/
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="text-danger">
          {error && error}
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
