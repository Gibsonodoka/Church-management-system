import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReactPaginate from "react-paginate"; // For pagination

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [newAttendance, setNewAttendance] = useState({
        date: "",
        month: "January", // Default month
        service_description: "Sunday Service", // Default service
        men: "",
        women: "",
        youth: "",
        teens: "",
        children: "",
        total: "",
    });
    const [editingRecord, setEditingRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Pagination state
    const [searchTerm, setSearchTerm] = useState(""); // Search state
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

    // Fetch attendance records from API
    const fetchAttendance = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/attendance");
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAttendance((prev) => {
            const updatedAttendance = {
                ...prev,
                [name]: value,
            };

            // Automatically calculate the total
            if (["men", "women", "youth", "teens", "children"].includes(name)) {
                const total =
                    parseInt(updatedAttendance.men || 0) +
                    parseInt(updatedAttendance.women || 0) +
                    parseInt(updatedAttendance.youth || 0) +
                    parseInt(updatedAttendance.teens || 0) +
                    parseInt(updatedAttendance.children || 0);
                updatedAttendance.total = total.toString();
            }

            return updatedAttendance;
        });
    };

    // Add or update attendance record
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting data:", newAttendance); // Debugging
        try {
            const formattedData = {
                ...newAttendance,
                date: new Date(newAttendance.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
            };

            if (editingRecord) {
                // Update record
                await axios.put(`http://127.0.0.1:8000/api/attendance/${editingRecord.id}`, formattedData);
                setEditingRecord(null);
            } else {
                // Create new record
                await axios.post("http://127.0.0.1:8000/api/attendance", formattedData);
            }
            setNewAttendance({
                date: "",
                month: "January", // Reset to default month
                service_description: "Sunday Service", // Reset to default service
                men: "",
                women: "",
                youth: "",
                teens: "",
                children: "",
                total: "",
            });
            setShowModal(false);
            fetchAttendance(); // Refresh the attendance list
        } catch (error) {
            console.error("Error saving attendance:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                alert(`Error: ${error.response.data.message || "Failed to save attendance"}`);
            } else {
                alert("Network error. Please check your connection.");
            }
        }
    };

    // Edit attendance record
    const handleEdit = (record) => {
        setEditingRecord(record);
        setNewAttendance(record);
        setShowModal(true);
    };

    // Delete attendance record
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this attendance record?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/attendance/${id}`);
                fetchAttendance(); // Refresh the attendance list
            } catch (error) {
                console.error("Error deleting attendance record:", error);
                alert("Failed to delete attendance record.");
            }
        }
    };

    // Reset form and close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRecord(null);
        setNewAttendance({
            date: "",
            month: "January", // Reset to default month
            service_description: "Sunday Service", // Reset to default service
            men: "",
            women: "",
            youth: "",
            teens: "",
            children: "",
            total: "",
        });
    };

    // Filter attendance records based on search term
    const filteredRecords = attendanceRecords.filter((record) =>
        `${record.date} ${record.month} ${record.service_description}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const offset = currentPage * itemsPerPage;
    const currentRecords = filteredRecords.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredRecords.length / itemsPerPage);

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
                            <h1 className="mt-4">Attendance Management</h1>

                            {/* Button to Open Add Attendance Modal */}
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => {
                                    setNewAttendance((prev) => ({
                                        ...prev,
                                        month: "January", // Set default month
                                        service_description: "Sunday Service", // Set default service
                                    }));
                                    setShowModal(true);
                                }}
                            >
                                Add Attendance
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
                                    placeholder="Search attendance..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Attendance List Table */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-table me-1"></i> Attendance Records
                                </div>
                                <div className="card-body">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Date</th>
                                                <th>Month</th>
                                                <th>Service</th>
                                                <th>Men</th>
                                                <th>Women</th>
                                                <th>Youth</th>
                                                <th>Teens</th>
                                                <th>Children</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.map((record, index) => (
                                                <tr key={record.id}>
                                                    <td>{offset + index + 1}</td>
                                                    <td>{record.date}</td>
                                                    <td>{record.month}</td>
                                                    <td>{record.service_description}</td>
                                                    <td>{record.men}</td>
                                                    <td>{record.women}</td>
                                                    <td>{record.youth}</td>
                                                    <td>{record.teens}</td>
                                                    <td>{record.children}</td>
                                                    <td>{record.total}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-warning me-2"
                                                            onClick={() => handleEdit(record)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(record.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    <ReactPaginate
                                        previousLabel={"← Previous"}
                                        nextLabel={"Next →"}
                                        pageCount={pageCount}
                                        onPageChange={handlePageChange}
                                        containerClassName={"pagination justify-content-end"}
                                        activeClassName={"active"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        disabledClassName={"disabled"}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>

            {/* Modal for Add/Edit Attendance */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingRecord ? "Edit Attendance" : "Add Attendance"}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {/* Date */}
                                        <div className="col-md-6">
                                            <label className="form-label">Date</label>
                                            <input type="date" name="date" value={newAttendance.date} onChange={handleChange} className="form-control" required />
                                        </div>

                                        {/* Month */}
                                        <div className="col-md-6">
                                            <label className="form-label">Month</label>
                                            <select name="month" value={newAttendance.month} onChange={handleChange} className="form-control" required>
                                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Service */}
                                        <div className="col-md-6">
                                            <label className="form-label">Service Description</label>
                                            <select name="service_description" value={newAttendance.service_description} onChange={handleChange} className="form-control" required>
                                                {["Sunday Service", "Midweek Service", "Night Vigil", "Prayer Rain", "Others"].map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Attendance Inputs */}
                                        {["men", "women", "youth", "teens", "children"].map((field) => (
                                            <div key={field} className="col-md-6">
                                                <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                                <input type="number" name={field} value={newAttendance[field]} onChange={handleChange} className="form-control" required />
                                            </div>
                                        ))}

                                        {/* Total (Read-only) */}
                                        <div className="col-md-6">
                                            <label className="form-label">Total</label>
                                            <input type="number" name="total" value={newAttendance.total} readOnly className="form-control" />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {editingRecord ? "Update" : "Add"} Attendance
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

export default Attendance;