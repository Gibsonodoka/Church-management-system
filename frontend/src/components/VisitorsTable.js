import React from "react";

const VisitorsTable = () => {
  // Dummy Data
  const visitors = [
    { firstName: "John", lastName: "Doe", phone: "123-456-7890", email: "johndoe@example.com", address: "123 Main St", date: "2025-02-28" },
    { firstName: "Jane", lastName: "Smith", phone: "987-654-3210", email: "janesmith@example.com", address: "456 Elm St", date: "2025-02-27" },
    { firstName: "Michael", lastName: "Johnson", phone: "555-123-4567", email: "michaelj@example.com", address: "789 Oak St", date: "2025-02-26" },
  ];

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        Recent Visitors
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Phone No.</th>
              <th>Email</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor, index) => (
              <tr key={index}>
                <td>{visitor.firstName}</td>
                <td>{visitor.lastName}</td>
                <td>{visitor.phone}</td>
                <td>{visitor.email}</td>
                <td>{visitor.address}</td>
                <td>{visitor.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorsTable;
