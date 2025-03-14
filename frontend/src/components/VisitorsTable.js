import React from "react";

const VisitorsTable = ({ visitors }) => {
  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>S/N</th>
          <th>Name</th> {/* Combined First Name and Last Name */}
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {visitors.map((visitor, index) => (
          <tr key={visitor.id}>
            <td>{index + 1}</td>
            <td>{visitor.firstname} {visitor.lastname}</td> {/* Combined Name */}
            <td>{visitor.phone}</td>
            <td>{visitor.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VisitorsTable;