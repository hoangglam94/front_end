import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-modal";

// Modal configuration
Modal.setAppElement("#root");

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    start: "",
    end: "",
  });

  // Handle event selection (opens modal for creating event)
  const handleSelect = (info) => {
    setEventDetails({
      ...eventDetails,
      start: info.start,
      end: info.end,
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
    };
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === updatedEvent.id ? updatedEvent : ev
      )
    );
  };

  // Handle event creation
  const handleCreateEvent = () => {
    const newEvent = {
      id: uuidv4(),
      title: eventDetails.title,
      start: eventDetails.start,
      end: eventDetails.end,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsModalOpen(false); // Close modal after event is created
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
        <form>
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
              value={eventDetails.start ? eventDetails.start.toISOString().slice(0, 16) : ""}
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
              value={eventDetails.end ? eventDetails.end.toISOString().slice(0, 16) : ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <button type="button" onClick={handleCreateEvent}>
              Create Event
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
