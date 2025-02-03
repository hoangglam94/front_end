import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");  // Redirect back to home page after logout
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default Logout;