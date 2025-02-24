import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProjectDetails.css"

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract the ID from the URL
  const url = "https://backend-server-d9vj.onrender.com";



  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${url}/api/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError("Error fetching project details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]); 

  console.log(project);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-details">
      {project ? (
        <>
          <h1>{project.pName}</h1>
          <p className="project-description">
            <span className="description-label">Description:  </span>
            <span className="description-content">  {project.PDescription}</span>
          </p>
          {/* Add more project details as needed */}
        </>
      ) : (
        <p>No project found.</p>
      )}
      </div>
    );
};


export default ProjectDetails;