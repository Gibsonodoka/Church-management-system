import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Tooltip } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

// Set up the localizer for moment
const localizer = momentLocalizer(moment);

const BirthdayCalendar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            axios
                .get("http://127.0.0.1:8000/api/members/birthdays", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const formattedEvents = response.data.map((member) => {
                        const currentYear = new Date().getFullYear();
                        const birthdayDate = new Date(currentYear, member.month - 1, member.day);

                        return {
                            title: `${member.name}'s Birthday`,
                            start: birthdayDate,
                            end: birthdayDate,
                            allDay: true,
                        };
                    });
                    setEvents(formattedEvents);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching birthdays:", error);
                    setLoading(false);
                    alert("Failed to fetch birthdays. Please try again later.");
                });
        }
    }, [navigate]);

    const eventStyleGetter = (event) => {
        const month = event.start.getMonth();
        let backgroundColor = "#ffcccb"; // Default color (light red)

        if (month === 0) backgroundColor = "#add8e6"; // January (light blue)
        if (month === 1) backgroundColor = "#90ee90"; // February (light green)
        // Add more conditions for other months

        return {
            style: {
                backgroundColor,
                borderRadius: "5px",
                border: "none",
            },
        };
    };

    const CustomTooltip = ({ event }) => (
        <div style={{ padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc" }}>
            <strong>{event.title}</strong>
            <p>Wish them a happy birthday!</p>
        </div>
    );

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
                            <h1 className="mt-4">Birthday Calendar</h1>
                            <p>View members' birthdays in the calendar.</p>

                            <div style={{ height: "700px" }}>
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView="month"
                                    views={["month", "week", "day"]}
                                    tooltipAccessor={(event) => event.title}
                                    eventPropGetter={eventStyleGetter}
                                    components={{
                                        tooltip: CustomTooltip,
                                    }}
                                />
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default BirthdayCalendar;