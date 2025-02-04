import React, { useState, useEffect } from 'react';
import './SignUp.css';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [error, setError] = useState('');
  const [manager, setManager] = useState('');
  const navigate = useNavigate();
  const url ="https://backend-server-d9vj.onrender.com:3030";
  useEffect(() => {
    setManager(isAdmin ? '1' : '0');
  }, [isAdmin]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(url+'/signup', { name, email, password, manager });
      console.log(response);

      if (response.data.signUpStatus && isAdmin) {
        alert('Created admin account successfully')
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Redirect to admin dashboard
      } else if (response.data.signUpStatus) {
        alert('Created account successfully')
        localStorage.setItem('token', response.data.token);
        navigate('/assignskill'); // Redirect to assign skill page
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred during sign up.');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'isAdmin') {
      setIsAdmin(checked);
      setIsEmployee(!checked);

    } else if (name === 'isEmployee') {
      setIsEmployee(checked);
      setIsAdmin(!checked);

    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="text-danger">
          {error && error}
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div>
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={isAdmin}
              onChange={handleCheckboxChange}
            />
            Admin
          </label>
          <label>
            <input
              type="checkbox"
              name="isEmployee"
              checked={isEmployee}
              onChange={handleCheckboxChange}
            />
            Employee
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;