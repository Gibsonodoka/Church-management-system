import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/Events/EventForm";

const localizer = momentLocalizer(moment);

const EventsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            fetchEvents();
        }
    }, [navigate]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/church-events", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const formattedEvents = response.data.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                description: event.description,
                location: event.location,
                organizer: event.organizer,
                type: event.type,
            }));
            setEvents(formattedEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/church-events/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchEvents(); // Refresh the events list
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <h1 className="mt-4">Church Events Calendar</h1>
                            <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
                                Add Event
                            </button>

                            {/* Event Form Modal */}
                            {showForm && (
                                <EventForm
                                    event={selectedEvent}
                                    onClose={() => {
                                        setShowForm(false);
                                        setSelectedEvent(null);
                                    }}
                                    onSave={fetchEvents}
                                />
                            )}

                            {/* Calendar Component */}
                            <div style={{ height: "700px" }}>
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView="month"
                                    views={["month", "week", "day"]}
                                    onSelectEvent={(event) => {
                                        setSelectedEvent(event);
                                        setShowForm(true);
                                    }}
                                    eventPropGetter={(event) => ({
                                        style: {
                                            backgroundColor: event.type === "church" ? "#add8e6" : "#90ee90", // Customize event colors
                                            borderRadius: "5px",
                                            border: "none",
                                        },
                                    })}
                                />
                            </div>

                            {/* Event List */}
                            <div className="mt-4">
                                <h3>Event List</h3>
                                <ul className="list-group">
                                    {events.map((event) => (
                                        <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{event.title}</strong>
                                                <p>{event.description}</p>
                                                <small>
                                                    {moment(event.start).format("MMMM Do YYYY, h:mm a")} - {moment(event.end).format("MMMM Do YYYY, h:mm a")}
                                                </small>
                                                <div>
                                                    <strong>Location:</strong> {event.location}
                                                </div>
                                                <div>
                                                    <strong>Organizer:</strong> {event.organizer}
                                                </div>
                                                <div>
                                                    <strong>Type:</strong> {event.type}
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => {
                                                        setSelectedEvent(event); // Pass the event object to setSelectedEvent
                                                        setShowForm(true); // Open the modal
                                                    }}
                                                    >
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default EventsPage;