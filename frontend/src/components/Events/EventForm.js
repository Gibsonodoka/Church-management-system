import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const EventForm = ({ event, onClose, onSave }) => {
    const [title, setTitle] = useState(event ? event.title : "");
    const [description, setDescription] = useState(event ? event.description : "");
    const [start, setStart] = useState(event ? event.start.toISOString().slice(0, 16) : "");
    const [end, setEnd] = useState(event ? event.end.toISOString().slice(0, 16) : "");
    const [location, setLocation] = useState(event ? event.location : "");
    const [organizer, setOrganizer] = useState(event ? event.organizer : "");
    const [type, setType] = useState(event ? event.type : "church");

    // Update form fields when the event prop changes
    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setStart(event.start.toISOString().slice(0, 16));
            setEnd(event.end.toISOString().slice(0, 16));
            setLocation(event.location);
            setOrganizer(event.organizer);
            setType(event.type);
        }
    }, [event]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventData = { title, description, start, end, location, organizer, type };

        try {
            if (event) {
                // Update existing event
                await axios.put(`http://127.0.0.1:8000/api/church-events/${event.id}`, eventData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            } else {
                // Create new event
                await axios.post("http://127.0.0.1:8000/api/church-events", eventData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }
            onSave(); // Refresh the events list
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{event ? "Edit Event" : "Add Event"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Container>
                        {/* Title and Description */}
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Start and End Date & Time */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date & Time</Form.Label>
                                    <Form.Control type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date & Time</Form.Label>
                                    <Form.Control type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Location and Organizer */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Organizer</Form.Label>
                                    <Form.Control type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Event Type */}
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                                        <option value="church">Church</option>
                                        <option value="community">Community</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    {/* Save and Cancel Buttons */}
                    <div className="d-flex justify-content-end">
                        <Button type="submit" className="me-2">
                            Save
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EventForm;