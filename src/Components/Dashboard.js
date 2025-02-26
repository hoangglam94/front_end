import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "./Calendar"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "https://backend-server-d9vj.onrender.com";


  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem("token");

        const result = await axios.get(url + "/api/get-email", {
          headers: {
            Authorization: `${token}`,
          },
        });

        const temp = result.data.email;
        setEmail(temp);
        return temp;
      } catch (error) {
        if (error.response) {
          console.error("Error fetching email:", error.response.data.message);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
        setError("Error fetching email");
      }
    };

    const fetchProjects = async (email) => {
      try {
        const response = await axios.get(url + "/api/projects", {
          params: { email },
        });

        const existingProjectIds = new Set(projects.map((project) => project.id));
        const newProjects = response.data.filter((project) => !existingProjectIds.has(project.id));

        setProjects((prevProjects) => {
          const existingIds = new Set(prevProjects.map((project) => project.id));
          return newProjects.reduce((acc, project) => {
            if (!existingIds.has(project.id)) {
              acc.push(project);
            }
            return acc;
          }, [...prevProjects]);
        });
      } catch (err) {
        setError("Error fetching projects");
        console.error(err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const email = await fetchEmail();
      if (email) {
        await fetchProjects(email);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
          projects.map((project) => {
          return(
            <div key={project.id} className="project-item" 
            onClick={() => handleProjectClick(project.id)}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
            style={{ color: hoveredProjectId === project.id ? 'red' : 'black' }} // Change color based on hover state                        
            >
              <h3>{project.projectName}</h3>
            </div>);
      })
        ) : (
          <p>No projects available.</p>
        )}
      </div>
      <button className="create-project-btn" onClick={handleCreateProject}>
        Create Project
      </button>

      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
