import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImportExport from "../components/Attendance/ImportExport";
import Modal from "../components/Attendance/Modal";
import Table from "../components/Attendance/Table";
import Analytics from "../components/Attendance/Analytics";

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [newAttendance, setNewAttendance] = useState({
        date: "",
        month: "January",
        service_description: "Sunday Service",
        men: "",
        women: "",
        youth: "",
        teens: "",
        children: "",
        total: "",
    });
    const [editingRecord, setEditingRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
                month: "January",
                service_description: "Sunday Service",
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
            month: "January",
            service_description: "Sunday Service",
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

                            {/* Add Import/Export Buttons */}
                            <ImportExport attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />

                            {/* Button to Open Add Attendance Modal */}
                            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
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

                            {/* Attendance Table */}
                            <Table
                                currentRecords={currentRecords}
                                offset={offset}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                pageCount={pageCount}
                                handlePageChange={handlePageChange}
                            />
                            {/* Attendance Analytics */}
                            <Analytics attendanceRecords={attendanceRecords} />
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>

            {/* Modal for Add/Edit Attendance */}
            <Modal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                newAttendance={newAttendance}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editingRecord={editingRecord}
            />
        </div>
    );
};

export default Attendance;