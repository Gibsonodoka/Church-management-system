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
  const [editId, setEditId] = useState(null);
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

  const handleDelete = async (id) => {
    if (await deleteDepartment(id)) {
      setDepartments(departments.filter(dep => dep.id !== id));
    }
  };

  const handleUpdate = async () => {
    if (!editId || editName.trim() === "") return;
    const updated = await updateDepartment(editId, editName);
    if (updated) {
      setDepartments(departments.map(dep => dep.id === editId ? updated : dep));
      setEditId(null);
      setEditName("");
    }
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

              {/* Departments List */}
              <div className="grid grid-cols-3 gap-4">
                {departments.map((dep) => (
                  <div key={dep.id} className="border p-4 rounded shadow">
                    {editId === dep.id ? (
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-2"
                      />
                    ) : (
                      <h3 className="text-xl font-bold">{dep.name}</h3>
                    )}
                    <div className="mt-2">
                      {editId === dep.id ? (
                        <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 mr-2">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => { setEditId(dep.id); setEditName(dep.name); }} 
                          className="bg-yellow-500 text-white px-2 py-1 mr-2">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDelete(dep.id)} className="bg-red-500 text-white px-2 py-1">
                        Delete
                      </button>
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