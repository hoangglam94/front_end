import React, { useState } from 'react';
import './LogIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('54.191.253.12:3030/login', { email, password });
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