import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate for navigation in React Router v6
import axios from 'axios';


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();  // Use useNavigate for navigation

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const fetchProjects = async () => {
      try {
          const response = await axios.get('backend-server-d9vj:3030/api/projects');
          console.log(response.data)
          
          const existingProjectIds = new Set(projects.map(project => project.id));
          // Filter out duplicates and update the state
          const newProjects = response.data.filter(project => !existingProjectIds.has(project.id));
          setProjects(prevProjects => {
          const existingIds = new Set(prevProjects.map(project => project.id));
          return newProjects.reduce((acc, project) => {
            if (!existingIds.has(project.id)) {
              acc.push(project);      
            }        
            return acc;
          }, [...prevProjects]);
          });

      } catch (err) {
          setError('Error fetching data');
          console.error(err);          //Login for debug
      } finally {
          setLoading(true);
      }
  };
  fetchProjects();
},[] );

//update projects
useEffect(() => {
  console.log("Updated projects:", projects);
  setLoading(false);
}, [projects]);


  const handleCreateProject = () => {
    navigate('/create-project');  // Redirect to create-project page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div className="dashboard">
      <h1>Your Projects</h1>
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((projects) => (
            <div key={projects.id} className="project-item">
              <h3>{projects.projectName}</h3>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
        </div>
        </div>    
  );
};

export default Dashboard;