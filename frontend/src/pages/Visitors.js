import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../css/main.css";
import { CSVLink } from "react-csv";
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
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    invited_by: "",
    occupation: "",
    visit_request: "",  // Matches Laravel's "visit_request"
    membership_interest: "", // Matches Laravel's "membership_interest"
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
      const response = await axios.post("http://127.0.0.1:8000/api/visitors", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Success:", response.data);
      alert("Visitor added successfully!");
      
      setShowModal(false);
      fetchVisitors(token);
      
      // Reset form
      setFormData({
        firstname: "",
        lastname: "",
        gender: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        invited_by: "",
        occupation: "",
        visit_request: "",  // Matches Laravel's "visit_request"
        membership_interest: "",
      });
  
    } catch (error) {
      console.error("Error adding visitor:", error);
      
      // Log error details
      if (error.response) {
        console.log("Server Response:", error.response.data);
        console.log("Status Code:", error.response.status);
        alert(`Failed to add visitor: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        console.log("No response received:", error.request);
        alert("Failed to add visitor: No response from server.");
      } else {
        console.log("Axios error:", error.message);
        alert("Failed to add visitor: " + error.message);
      }
    }
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Church Visitors List", 10, 10);
    doc.autoTable({
      head: [["ID", "Name", "Gender", "Email", "Phone", "Visit Date"]],
      body: visitors.map((visitor) => [
        visitor.id,
        `${visitor.first_name} ${visitor.last_name}`,
        visitor.gender,
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
                        <th>Gender</th>
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
                            <td>{visitor.gender}</td>
                            <td>{visitor.email || "N/A"}</td>
                            <td>{visitor.phone || "N/A"}</td>
                            <td>{visitor.visit_date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No visitors found</td>
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
            <div className="row">
              {/* First Name */}
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  name="firstname" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.first_name} 
                  required 
                />
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  name="lastname" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.last_name} 
                  required 
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select 
                  name="gender" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.gender} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.email} 
                  required 
                />
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.phone} 
                  required 
                />
              </div>

              {/* Date of Birth */}
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.dob} 
                  required 
                />
              </div>

              {/* Address */}
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.address} 
                  required 
                />
              </div>

              {/* Who Invited You? */}
              <div className="col-md-6">
                <label className="form-label">Who Invited You?</label>
                <input 
                  type="text" 
                  name="invited_by" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.invited_by} 
                />
              </div>

              {/* Occupation */}
              <div className="col-md-6">
                <label className="form-label">Occupation</label>
                <input 
                  type="text" 
                  name="occupation" 
                  className="form-control" 
                  onChange={handleChange} 
                  value={formData.occupation} 
                />
              </div>

              {/* Would You Like to Be Visited? */}
              <div className="col-md-6">
                <label className="form-label">Would you like to be visited?</label>
                <div>
                <input type="radio" 
                   name="visit_request" 
                      value="Yes" 
                      checked={formData.visit_request === "Yes"} 
                      onChange={handleChange} 
                      /> Yes
                  <input 
                      type="radio" 
                      name="visit_request" 
                      value="No" 
                      checked={formData.visit_request === "No"} 
                      onChange={handleChange} 
                      className="ms-3"
                    /> No
                </div>
              </div>

              {/* Want to be a Member? */}
              <div className="col-md-6">
                <label className="form-label">Want to be a member?</label>
                <div>
                  <input 
                    type="radio" 
                    name="membership_interest" 
                    value="Yes" 
                    checked={formData.membership_interest === "Yes"} 
                    onChange={handleChange} 
                  /> Yes
                  <input 
                    type="radio" 
                    name="membership_interest" 
                    value="No" 
                    checked={formData.membership_interest === "No"} 
                    onChange={handleChange} 
                    className="ms-3"
                  /> No

                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-3">
              <button type="submit" className="btn btn-primary w-100">Add Visitor</button>
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

export default Visitors;
