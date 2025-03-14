import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");  
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default Logout;