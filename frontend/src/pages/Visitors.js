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
        gender: "M",
        want_to_be_member: false,
        would_like_visit: false,
    });
    const [editingVisitor, setEditingVisitor] = useState(null);

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
            setNewVisitor({ firstname: "", lastname: "", phone: "", gender: "M", want_to_be_member: false, would_like_visit: false });
            fetchVisitors();
        } catch (error) {
            console.error("Error saving visitor:", error);
        }
    };

    // Edit visitor
    const handleEdit = (visitor) => {
        setEditingVisitor(visitor);
        setNewVisitor(visitor);
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

                            {/* Visitor Form */}
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="row g-3">
                                    <div className="col-md-4">
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
                                    <div className="col-md-4">
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
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={newVisitor.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
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
                                    <div className="col-md-4">
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
                                    <div className="col-md-4">
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
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary">
                                            {editingVisitor ? "Update" : "Add"} Visitor
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Visitor List */}
                            <h3>Visitor List</h3>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Gender</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.map((visitor) => (
                                        <tr key={visitor.id}>
                                            <td>{visitor.firstname} {visitor.lastname}</td>
                                            <td>{visitor.phone}</td>
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
        </div>
    );
};

export default Visitors;