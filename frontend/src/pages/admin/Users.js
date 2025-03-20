import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const User = () => {
    const [users, setUsers] = useState([]); // State to store users
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role_id: "",
    }); // State for new user form
    const [editingUser, setEditingUser] = useState(null); // State for editing user
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentPage, setCurrentPage] = useState(0); // State for pagination
    const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
    const [itemsPerPage, setItemsPerPage] = useState(10); // State for items per page

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            console.log("Fetching users...");
            const response = await axios.get("http://127.0.0.1:8000/api/users");
            console.log("API Response:", response.data); // Log the response
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log("Users state:", users); // Log the users state

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add or update user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update user
                await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, newUser);
            } else {
                // Create new user
                await axios.post("http://127.0.0.1:8000/api/users", newUser);
            }
            setNewUser({
                name: "",
                email: "",
                password: "",
                role_id: "",
            });
            setShowModal(false);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error saving user:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                alert(`Error: ${error.response.data.message || "Failed to save user"}`);
            } else {
                alert("Network error. Please check your connection.");
            }
        }
    };

    // Edit user
    const handleEdit = (user) => {
        setEditingUser(user);
        setNewUser(user);
        setShowModal(true);
    };

    // Delete user
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    // Reset form and close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setNewUser({
            name: "",
            email: "",
            password: "",
            role_id: "",
        });
    };

    // Filter users based on search term
    const filteredUsers = users.filter((user) =>
        `${user.name} ${user.email} ${user.role_id}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const offset = currentPage * itemsPerPage;
    const currentUsers = filteredUsers.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
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
                            <h1 className="mt-4">User Management</h1>

                            {/* Button to Open Add User Modal */}
                            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                                Add User
                            </button>

                            {/* Search and Items Per Page */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center">
                                    <label className="me-2">Show</label>
                                    <select
                                        className="form-select d-inline w-auto"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(parseInt(e.target.value));
                                            setCurrentPage(0); // Reset to first page
                                        }}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                    <label className="ms-2">entries</label>
                                </div>
                                <input
                                    type="text"
                                    className="form-control w-auto"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* User Table */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{offset + index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role_id}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="d-flex justify-content-end">
                                <nav>
                                    <ul className="pagination">
                                        {Array.from({ length: pageCount }, (_, i) => (
                                            <li
                                                key={i}
                                                className={`page-item ${currentPage === i ? "active" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(i)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>

            {/* Modal for Add/Edit User */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingUser ? "Edit User" : "Add User"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={newUser.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={newUser.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            name="role_id"
                                            value={newUser.role_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="1">Super Admin</option>
                                            <option value="2">Senior Pastor</option>
                                            <option value="3">Pastor</option>
                                            <option value="4">Team Head</option>
                                            <option value="5">Admin</option>
                                            <option value="6">Member</option>
                                        </select>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingUser ? "Update" : "Save"}
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

export default User;