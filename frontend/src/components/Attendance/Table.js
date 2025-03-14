import React from "react";
import ReactPaginate from "react-paginate";

const Table = ({ currentRecords, offset, handleEdit, handleDelete, pageCount, handlePageChange }) => {
    return (
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
    );
};

export default Table;