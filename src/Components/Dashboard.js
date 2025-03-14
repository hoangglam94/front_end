import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "./Calendar"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Store isAdmin status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "https://backend-server-d9vj.onrender.com";

  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const result = await axios.get(url + "/api/get-email", {
          headers: { Authorization: `${token}` },
        });

        setEmail(result.data.email);
        setIsAdmin(result.data.isAdmin); // Ensure backend returns isAdmin in this endpoint
      } catch (error) {
        setError("Error fetching user data");
        console.error(error);
      }
    };

    const fetchProjects = async (userEmail) => {
      try {
        const response = await axios.get(url + "/api/projects", {
          params: { email: userEmail },
        });

        setProjects(response.data);
      } catch (err) {
        setError("Error fetching projects");
        console.error(err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchUserData();
      if (email) {
        await fetchProjects(email);
      }
      setLoading(false);
    };

    fetchData();
  }, [email]); // Fetch projects whenever email changes

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h1>Your Projects</h1>
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="project-item"
              onClick={() => handleProjectClick(project.id)}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              style={{ color: hoveredProjectId === project.id ? "red" : "black" }}
            >
              <h3>{project.projectName}</h3>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>

      {/* Show Create Project button only if user is an admin */}
      {isAdmin && (
        <button className="create-project-btn" onClick={handleCreateProject}>
          Create Project
        </button>
      )}

      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
