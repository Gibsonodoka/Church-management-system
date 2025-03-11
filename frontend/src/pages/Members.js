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

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    marital_status: "",
    baptized: "",
    membership_class: "",
    house_fellowship: "",
    organization: "",
    current_team: [],
  });




  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchMembers(token);
    }
  }, [navigate]);


  // Function to Export Data as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Church Members List", 10, 10);
    doc.autoTable({
      head: [["ID", "Name", "Email", "Phone"]],
      body: members.map((member) => [
        member.id,
        member.name,
        member.email,
        member.phone,
      ]),
    });
    doc.save("Members_List.pdf");
  };

  // Function to Handle File Import
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  // Function to Process Import File
  const handleImport = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Send data to backend
      axios
        .post("http://127.0.0.1:8000/api/members/import", parsedData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          alert("Data imported successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error importing data:", error);
          alert("Import failed. Check console for details.");
        });
    };
  };


  const fetchMembers = (token) => {
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
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        current_team: checked
          ? [...prevData.current_team, value]
          : prevData.current_team.filter((team) => team !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://127.0.0.1:8000/api/members", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Member added successfully!");
      setShowModal(false);
      fetchMembers(token);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        address: "",
        marital_status: "",
        baptized: "",
        membership_class: "",
        house_fellowship: "",
        organization: "",
        current_team: [],
      });
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member. Please try again.");
    }
  };

  const filteredMembers = members.filter((member) =>
    `${member.first_name} ${member.last_name} ${member.email} ${member.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentMembers = filteredMembers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredMembers.length / itemsPerPage);

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
              <h1 className="mt-4">Members</h1>
              <p>List of all church members</p>

              {/* Add Member Button */}
              <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                Add Member
              </button>

              <div className="mb-3">
                {/* Export Buttons */}
                <CSVLink
                  data={members}
                  filename={"Members_List.csv"}
                  className="btn btn-success me-2"
                >
                  Export CSV
                </CSVLink>
                <button onClick={exportToPDF} className="btn btn-danger">
                  Export PDF
                </button>
              </div>

              <div className="mb-3">
                {/* Import Section */}
                <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
                <button onClick={handleImport} className="btn btn-primary ms-2">
                  Import
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-table me-1"></i> Church Members
                </div>
                <div className="card-body">
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
                    <input
                      type="text"
                      className="form-control w-auto"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No members found</td>
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

    {/* Add Member Modal */}
{showModal && (
  <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
    <div className="modal-dialog modal-lg"> {/* Make modal larger for better spacing */}
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Member</h5>
          <button className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="grid-form">
            <div className="form-grid">
              <input type="text" name="first_name" placeholder="First Name" className="form-control" value={formData.first_name} onChange={handleChange} required />
              <input type="text" name="last_name" placeholder="Last Name" className="form-control" value={formData.last_name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" className="form-control" value={formData.email} onChange={handleChange} />
              <input type="text" name="phone" placeholder="Phone" className="form-control" value={formData.phone} onChange={handleChange} required />
              
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
              <input type="text" name="address" placeholder="Address" className="form-control" value={formData.address} onChange={handleChange} required />

              <select name="marital_status" className="form-control" value={formData.marital_status} onChange={handleChange} required>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>

              <select name="baptized" className="form-control" value={formData.baptized} onChange={handleChange} required>
                <option value="">Baptized?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <select name="membership_class" className="form-control" value={formData.membership_class} onChange={handleChange} required>
                <option value="">Membership Class</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <select name="house_fellowship" className="form-control" value={formData.house_fellowship} onChange={handleChange} required>
                <option value="">Select House Fellowship</option>
                <option value="Rumibekwe">Rumibekwe</option>
                <option value="Woji">Woji</option>
                <option value="Rumudara">Rumudara</option>
                <option value="None">None</option>
              </select>

              <select name="organization" className="form-control" value={formData.organization} onChange={handleChange} required>
                <option value="">Select Organization</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Youth">Youth</option>
                <option value="Teens">Teens</option>
                <option value="Children">Children</option>
              </select>
            </div>

            {/* Checkbox Section - Full width */}
            <div className="checkbox-section">
              <label className="form-label">Current Team (Select multiple)</label>
              <div className="d-flex flex-wrap gap-2">
                {["Drama", "Media", "Technical", "Visitation", "Leadership", "Pastoral", "Sunday school", "None"].map((team) => (
                  <div key={team} className="form-check">
                    <input
                      type="checkbox"
                      name="current_team"
                      value={team}
                      checked={formData.current_team.includes(team)}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">{team}</label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3">Add Member</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Members;
