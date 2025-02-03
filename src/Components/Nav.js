import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    return (
        <div>
            <ul className="navigation-ul">
                <li><Link to="/">Home</Link></li>

                {token ? (
                    <>
                        <li><Link to="/Dashboard">Dashboard</Link></li>
                        <li><Link to="/Profile">Profile</Link></li>
                        <li><Link to="/emdashboard">EmployeeDash</Link></li>
                        <li>
                            <button 
                                onClick={handleLogout} 
                                style={{
                                    border: 'none', 
                                    background: 'none', 
                                    cursor: 'pointer', 
                                    color: 'black', 
                                    textDecoration: 'none'
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/LogIn">Log In</Link></li>
                        <li><Link to="/SignUp">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Nav;