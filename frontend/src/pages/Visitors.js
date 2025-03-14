import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [newVisitor, setNewVisitor] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        address: "",
        dob: "",
        gender: "M",
        want_to_be_member: false,
        would_like_visit: false,
    });
    const [editingVisitor, setEditingVisitor] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    // Fetch visitors from API
    const fetchVisitors = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/visitors");
            setVisitors(response.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewVisitor((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Add or update visitor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVisitor) {
                // Update visitor
                await axios.put(`http://127.0.0.1:8000/api/visitors/${editingVisitor.id}`, newVisitor);
                setEditingVisitor(null);
            } else {
                // Create new visitor
                await axios.post("http://127.0.0.1:8000/api/visitors", newVisitor);
            }
            setNewVisitor({ firstname: "", lastname: "", phone: "", email: "", address: "", dob: "", gender: "M", want_to_be_member: false, would_like_visit: false });
            setShowModal(false); // Close modal after submission
            fetchVisitors();
        } catch (error) {
            console.error("Error saving visitor:", error);
        }
    };

    // Edit visitor
    const handleEdit = (visitor) => {
        setEditingVisitor(visitor);
        setNewVisitor(visitor);
        setShowModal(true); // Open modal for editing
    };

    // Delete visitor
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visitor?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/visitors/${id}`);
                fetchVisitors();
            } catch (error) {
                console.error("Error deleting visitor:", error);
            }
        }
    };

    // Reset form and close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVisitor(null);
        setNewVisitor({ firstname: "", lastname: "", phone: "", email: "", address: "", dob: "", gender: "M", want_to_be_member: false, would_like_visit: false });
    };

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
                            <h1 className="mt-4">Visitors Management</h1>

                            {/* Button to Open Add Visitor Modal */}
                            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                                Add Visitor
                            </button>

                            {/* Visitor List */}
                            <h3>Visitor List</h3>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th> {/* Added ID Column */}
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>DOB</th>
                                        <th>Gender</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.map((visitor) => (
                                        <tr key={visitor.id}>
                                            <td>{visitor.id}</td> {/* Display Visitor ID */}
                                            <td>{visitor.firstname}</td>
                                            <td>{visitor.lastname}</td>
                                            <td>{visitor.phone}</td>
                                            <td>{visitor.email}</td>
                                            <td>{visitor.address}</td>
                                            <td>{visitor.dob}</td>
                                            <td>{visitor.gender === "M" ? "Male" : "Female"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(visitor)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(visitor.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>

            {/* Modal for Add/Edit Visitor */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingVisitor ? "Edit Visitor" : "Add Visitor"}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {/* First Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                name="firstname"
                                                value={newVisitor.firstname}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={newVisitor.lastname}
                                                onChange={handleChange}
                                                placeholder="Last Name"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={newVisitor.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-6">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={newVisitor.phone}
                                                onChange={handleChange}
                                                placeholder="Phone"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-md-12">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newVisitor.address}
                                                onChange={handleChange}
                                                placeholder="Address"
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="col-md-6">
                                            <label className="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={newVisitor.dob}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="col-md-6">
                                            <label className="form-label">Gender</label>
                                            <select
                                                name="gender"
                                                value={newVisitor.gender}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            >
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                            </select>
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="col-md-6">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    name="want_to_be_member"
                                                    checked={newVisitor.want_to_be_member}
                                                    onChange={handleChange}
                                                    className="form-check-input"
                                                />
                                                Want to be a member?
                                            </label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-check-label">
                                                <input
                                                    type="checkbox"
                                                    name="would_like_visit"
                                                    checked={newVisitor.would_like_visit}
                                                    onChange={handleChange}
                                                    className="form-check-input"
                                                />
                                                Would like a visit?
                                            </label>
                                        </div>
                                    </div>

                                    {/* Form Buttons */}
                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingVisitor ? "Update" : "Add"} Visitor
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Visitors;