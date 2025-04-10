import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Nav.css';
import axios from 'axios';
import AddUser from './AddUser.js';

const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To detect route changes
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const url = "https://backend-server-d9vj.onrender.com";

    // Check login status and fetch admin status whenever the route changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Update login state

        const fetchAdmin = async () => {
            try {
                if (!token) {
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                const result = await axios.get(url + '/api/get-email', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const temp = result.data.isAdmin;

                setIsAdmin(temp);
                setLoading(false);
            } catch (error) {
                if (error.response) {
                    console.error("Error in checking:", error.response.data.message);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                } else {
                    console.error("Error:", error.message);
                }
                setError('Error fetching');
            }
        };

        fetchAdmin();
    }, [location]); // Re-run when the route changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Update login state
        navigate('/login'); // Redirect to login immediately
    };

    const handleAddUser  = (email) => {
        if (window.confirm(`Are you sure you want to add ${email} to your workspace?`)) {
            const updateEmail = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post(url + '/api/updatwp', { email }, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                    alert('User added successfully!'); 
                } catch (error) {
                    if (error.response) {
                        console.error("Error in updating email:", error.response.data.message);
                        setError(error.response.data.message);
                    } else if (error.request) {
                        console.error("No response received:", error.request);
                        setError('No response from server');
                    } else {
                        console.error("Error:", error.message);
                        setError('Error updating email');
                    }
                } finally {
                    setLoading(false);
                    setShowModal(false); // Close modal after operation
                }
            };
            updateEmail(); // Call the function to update email
        }
    };

    return (
        <nav className="nav-container">
            <h1 className="nav-logo">Team Builder Clash</h1>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        {isAdmin && <li><Link to="#" className="add-user-link" onClick={() => setShowModal(true)}>Add user to your workspace</Link></li>}
                        <li><a href="#" className="logout-link" onClick={handleLogout}>Logout</a></li> {/* Logout as a link */}
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Log In</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
            {showModal && <AddUser onClose={() => setShowModal(false)} onAdd={handleAddUser} />}
            {loading && <p>Loading...</p>}        
            {error && <p style={{ color: 'red'}}>{error}</p>} {/* Display error message */}
        </nav>
    );
};

export default Nav;
