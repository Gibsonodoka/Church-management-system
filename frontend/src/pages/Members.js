import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../css/main.css";

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://127.0.0.1:8000/api/members", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setMembers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching members:", error);
        });
    }
  }, [navigate]);

  // Filter members based on search input
  const filteredMembers = members.filter((member) =>
    `${member.first_name} ${member.last_name} ${member.email} ${member.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Get members for the current page
  const offset = currentPage * itemsPerPage;
  const currentMembers = filteredMembers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredMembers.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <Navbar />

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Members</h1>
              <p>List of all church members</p>

              {/* Members Table Card */}
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-table me-1"></i> Church Members
                </div>
                <div className="card-body">
                  
                  {/* Search & Entries Selector Inside Table Container */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <label className="me-2">Show</label>
                      <select
                        className="form-select d-inline w-auto"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(parseInt(e.target.value));
                          setCurrentPage(0);
                        }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <label className="ms-2">entries</label>
                    </div>

                    {/* Search Input Inside Table Container */}
                    <div className="input-group w-auto">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>

                  {/* Members Table */}
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date of Birth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentMembers.length > 0 ? (
                        currentMembers.map((member) => (
                          <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.first_name}</td>
                            <td>{member.last_name}</td>
                            <td>{member.email || "N/A"}</td>
                            <td>{member.phone || "N/A"}</td>
                            <td>{member.dob || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No members found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Members;
