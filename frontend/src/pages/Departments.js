import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import Navbar from "../components/Navbar"; // Import Navbar
import Footer from "../components/Footer"; // Import Footer
import axios from "axios"; // Import axios
import { 
  getDepartments, 
  createDepartment, 
  deleteDepartment, 
  updateDepartment 
} from "../components/Departments/api/departmentApi";

const Departments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      // Fetch user data
      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });

      // Fetch departments list
      fetchDepartments();
    }
  }, [navigate]);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const handleCreate = async () => {
    if (newDepartment.trim() === "") return;
    const department = await createDepartment(newDepartment);
    if (department) {
      setDepartments([...departments, department]);
      setNewDepartment("");
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) {
      alert("Please select a department to delete.");
      return;
    }
    if (await deleteDepartment(selectedDepartment)) {
      setDepartments(departments.filter(dep => dep.id !== selectedDepartment));
      setSelectedDepartment("");
      alert("Department deleted successfully.");
    } else {
      alert("Failed to delete department.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedDepartment || editName.trim() === "") {
      alert("Please select a department and enter a new name.");
      return;
    }
    const updated = await updateDepartment(selectedDepartment, editName);
    if (updated) {
      setDepartments(departments.map(dep => dep.id === selectedDepartment ? updated : dep));
      setSelectedDepartment("");
      setEditName("");
      alert("Department updated successfully.");
    } else {
      alert("Failed to update department.");
    }
  };

  // Predefined colors for cards
  const cardColors = [
    "bg-primary",
    "bg-success",
    "bg-info",
    "bg-warning",
    "bg-danger",
    "bg-secondary",
  ];

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
              <h1 className="mt-4">Departments</h1>
              <p>Welcome {user ? user.name : "Loading..."} to Our Church Management System</p>

              {/* Add Department Form */}
              <div className="mb-4">
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Enter Department Name"
                  className="border p-2 mr-2"
                />
                <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2">
                  Create
                </button>
              </div>

              {/* Dropdown for Edit/Delete Actions */}
              <div className="mb-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    const selectedDept = departments.find(dep => dep.id === e.target.value);
                    setEditName(selectedDept ? selectedDept.name : "");
                  }}
                  className="border p-2 mr-2"
                >
                  <option value="">Select a Department</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter new name"
                  className="border p-2 mr-2"
                  disabled={!selectedDepartment}
                />
                <button
                  onClick={handleUpdate}
                  className="bg-yellow-500 text-white px-4 py-2 mr-2"
                  disabled={!selectedDepartment || !editName.trim()}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2"
                  disabled={!selectedDepartment}
                >
                  Delete
                </button>
              </div>

              {/* Departments List - Compact Cards with Individual Colors */}
              <div className="row">
                {departments.map((dep, index) => (
                  <div key={dep.id} className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4">
                    <div className={`card ${cardColors[index % cardColors.length]} text-white`}>
                      <div className="card-body">
                        <h5 className="card-title">{dep.name}</h5>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <h3 className="card-text">
                              {dep.membersCount || 0} {/* Example: Display number of members */}
                            </h3>
                          </div>
                          <i className="fas fa-building fa-2x"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Departments;