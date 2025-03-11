import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../css/main.css";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Visitors = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    visit_date: "",
    reason_for_visit: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchVisitors(token);
    }
  }, [navigate]);

  const fetchVisitors = (token) => {
    axios
      .get("http://127.0.0.1:8000/api/visitors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setVisitors(response.data))
      .catch((error) => console.error("Error fetching visitors:", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://127.0.0.1:8000/api/visitors", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Visitor added successfully!");
      setShowModal(false);
      fetchVisitors(token);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        visit_date: "",
        reason_for_visit: "",
      });
    } catch (error) {
      console.error("Error adding visitor:", error);
      alert("Failed to add visitor. Please try again.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Church Visitors List", 10, 10);
    doc.autoTable({
      head: [["ID", "Name", "Email", "Phone", "Visit Date"]],
      body: visitors.map((visitor) => [
        visitor.id,
        `${visitor.first_name} ${visitor.last_name}`,
        visitor.email,
        visitor.phone,
        visitor.visit_date,
      ]),
    });
    doc.save("Visitors_List.pdf");
  };

  const filteredVisitors = visitors.filter((visitor) =>
    `${visitor.first_name} ${visitor.last_name} ${visitor.email} ${visitor.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentVisitors = filteredVisitors.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredVisitors.length / itemsPerPage);

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
              <h1 className="mt-4">Visitors</h1>
              <p>List of all church visitors</p>

              <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                Add Visitor
              </button>

              <div className="mb-3">
                <CSVLink
                  data={visitors}
                  filename={"Visitors_List.csv"}
                  className="btn btn-success me-2"
                >
                  Export CSV
                </CSVLink>
                <button onClick={exportToPDF} className="btn btn-danger">
                  Export PDF
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-table me-1"></i> Church Visitors
                </div>
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control w-auto mb-3"
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Visit Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentVisitors.length > 0 ? (
                        currentVisitors.map((visitor) => (
                          <tr key={visitor.id}>
                            <td>{visitor.id}</td>
                            <td>{visitor.first_name}</td>
                            <td>{visitor.last_name}</td>
                            <td>{visitor.email || "N/A"}</td>
                            <td>{visitor.phone || "N/A"}</td>
                            <td>{visitor.visit_date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No visitors found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Visitor</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input type="text" name="first_name" placeholder="First Name" className="form-control mb-2" value={formData.first_name} onChange={handleChange} required />
                  <input type="text" name="last_name" placeholder="Last Name" className="form-control mb-2" value={formData.last_name} onChange={handleChange} required />
                  <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={formData.email} onChange={handleChange} />
                  <input type="text" name="phone" placeholder="Phone" className="form-control mb-2" value={formData.phone} onChange={handleChange} required />
                  <input type="date" name="visit_date" className="form-control mb-2" value={formData.visit_date} onChange={handleChange} required />
                  <button type="submit" className="btn btn-primary w-100">Add Visitor</button>
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
