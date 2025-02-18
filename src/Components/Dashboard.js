import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import axios from 'axios';
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuid } from "uuid";

export const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  const handleSelect = (info) => {
    const { start, end } = info;
    const eventNamePrompt = prompt("Enter, event name");
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          start,
          end,
          title: eventNamePrompt,
          id: uuid(),
        },
      ]);
    }
  };

  return (
    <div>
      <FullCalendar
        editable
        selectable
        events={events}
        select={handleSelect}
        headerToolbar={{
          start: "today prev next",
          end: "dayGridMonth dayGridWeek dayGridDay",
        }}
        plugins={[daygridPlugin, interactionPlugin]}
        views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
      />
    </div>
  );
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "https://backend-server-d9vj.onrender.com";
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem('token');

        const result = await axios.get(url+'/api/get-email', {
          headers: {
            Authorization: `${token}`
          }
        });

        const temp = result.data.email;
//        console.log("temp: ", temp);
        setEmail(temp); // Set the email state
//        console.log("Email: ", temp); // Use temp to log the correct email
        return temp; // Return the email for further use
      } catch (error) {
        if (error.response) {
          console.error("Error fetching email:", error.response.data.message);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
        setError('Error fetching email');
      }
    };

    const fetchProjects = async (email) => {
      try {
        const response = await axios.get(url+'/api/projects', {
          params: { email } // Send email as a query parameter or adjust as needed
        });

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
        setError('Error fetching projects');
        console.error(err);
      }
    };

    const fetchData = async () => {
      setLoading(true); // Start loading
      const email = await fetchEmail(); // Fetch email first
      if (email) {
        await fetchProjects(email); // Fetch projects using the fetched email
      }
      setLoading(false); // Stop loading after both are done
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  const handleCreateProject = () => {
    navigate('/create-project'); // Redirect to create-project page
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h1>Your Projects</h1>
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="project-item">
              <h3>{project.projectName}</h3>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>
      <button className="create-project-btn" onClick={handleCreateProject}>
        Create Project
      </button>
    </div>
  );
};

export default Dashboard;