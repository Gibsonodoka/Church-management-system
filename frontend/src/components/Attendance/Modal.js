import React from "react";

const Modal = ({ showModal, handleCloseModal, newAttendance, handleChange, handleSubmit, editingRecord }) => {
    if (!showModal) return null;

    return (
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
    );
};

export default Modal;