import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Modal configuration
Modal.setAppElement("#root");

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    start: "",
    end: "",
    color: "#ff0000", // Default color (red)
  });
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const url = "https://backend-server-d9vj.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch email
        const emailResponse = await axios.get(url + "/api/get-email", {
          headers: {
            Authorization: `${token}`,
          },
        });
        const fetchedEmail = emailResponse.data.email;
        setEmail(fetchedEmail);

        const eventsResponse = await axios.get(`${url}/api/events`, {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            email: fetchedEmail,          
            },
          });

        const formattedEvents = eventsResponse.data.map(event => ({
          id: event.id,
          title: event.name, 
          start: event.start, 
          end: event.end, 
          color: event.color,
  
        }));
        setEvents(formattedEvents); // Assuming the response data is an array of events
      } catch (error) {
        if (error.response) {
          console.error("Error fetching data:", error.response.data.message);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error:", error.message);
        }
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);



  // Handle event selection (opens modal for creating event)
  const handleSelect = (info) => {
    setEventDetails({
      ...eventDetails,
      start: info.start.toISOString().slice(0, 16),
      end: info.end.toISOString().slice(0, 16),
    });
    setIsModalOpen(true); // Open modal on selection
  };

  // Handle event drop (update event position)
  const handleEventDrop = (info) => {

    const { event } = info;
  
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color, // Keep the color intact
    };
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const eventData = {
        title: eventDetails.title,
        start: eventDetails.start,
        end: eventDetails.end,
        color: eventDetails.color,
        email: email,
    };
    console.log(eventData)
    
    try {
            const response = await axios.post(url+'/api/create-event', eventData);
            console.log('Event created successfully:', response.data);
                  
            // Update events state with the new event
            setEvents((prevEvents) => [...prevEvents, eventData]);
            setIsModalOpen(false);
        }catch (err) {
            console.error('Error creating event:', err);
            setError('Error creating event');
            setLoading(false);
        }finally{
          setLoading(false);
        }
            
  };
 


  // Handle modal input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        events={events}
        editable
        selectable
        select={handleSelect} // Event selection triggers modal
        eventDrop={handleEventDrop} // Drag and drop functionality
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="90vh" // Calendar height
      />

      {/* Modal for event creation */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Create Event">
        <h2>Create Event</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Event Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventDetails.title}
              onChange={handleInputChange}
              placeholder="Event name"
              required
            />
          </div>
          <div>
            <label htmlFor="start">Start Date:</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={eventDetails.start}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="end">End Date:</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={eventDetails.end}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="color">Event Color:</label>
            <input
              type="color"
              id="color"
              name="color"
              value={eventDetails.color}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Calendar;
