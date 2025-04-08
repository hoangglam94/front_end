import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProjectDetails.css";
import Chat from "./Chat"; // Ensure this import is at the top with other imports

const ProjectDetails = ({ userId }) => {
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Extract the ID from the URL
  const url = "https://backend-server-d9vj.onrender.com";
  //const url = "http://localhost:3031";

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

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${url}/api/projects/${id}/employees`);
        setEmployees(response.data);
      } catch (err) {
        setError("Error fetching employees");
        console.error(err);
      }
    };

    fetchProjectDetails();
    fetchEmployees();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-details">
      {project ? (
        <>
          <h1>{project.pName}</h1>
          <p className="enddate-detail">
            <span className="end-date-label">End Date:</span>
            <span className="end-date-content"> {formatDate(project.Enddate)}</span>
          </p>
          <p className="project-description">
            <span className="description-label">Description: </span>
            <span className="description-content">{project.PDescription}</span>
          </p>

          {/* Employees Section */}
          <div className="employees-container">
            <h2>Employees Involved</h2>
            {employees.length > 0 ? (
              <ul>
                {employees.map((employee) => (
                  <li key={employee.Emp_id} className="employee-item">
                    <span className="employee-name" title={employee.eEmail}>
                      {employee.eName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No employees assigned to this project.</p>
            )}
          </div>

          {/* Chat Component */}
          <Chat projectId={id} />
        </>
      ) : (
        <p>No project found.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
