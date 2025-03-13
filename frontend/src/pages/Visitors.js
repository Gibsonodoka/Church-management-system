import React, { useState, useEffect } from "react";
import axios from "axios";

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [newVisitor, setNewVisitor] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        gender: "M",
        want_to_be_member: false,
        would_like_visit: false,
    });
    const [editingVisitor, setEditingVisitor] = useState(null);

    // Fetch visitors from API
    const fetchVisitors = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/visitors");
            setVisitors(response.data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewVisitor((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Add new visitor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVisitor) {
                // Update visitor
                await axios.put(`http://127.0.0.1:8000/api/visitors/${editingVisitor.id}`, newVisitor);
                setEditingVisitor(null);
            } else {
                // Create new visitor
                await axios.post("http://127.0.0.1:8000/api/visitors", newVisitor);
            }
            setNewVisitor({ firstname: "", lastname: "", phone: "", gender: "M", want_to_be_member: false, would_like_visit: false });
            fetchVisitors();
        } catch (error) {
            console.error("Error saving visitor:", error);
        }
    };

    // Edit visitor
    const handleEdit = (visitor) => {
        setEditingVisitor(visitor);
        setNewVisitor(visitor);
    };

    // Delete visitor
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this visitor?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/visitors/${id}`);
                fetchVisitors();
            } catch (error) {
                console.error("Error deleting visitor:", error);
            }
        }
    };

    return (
        <div>
            <h2>Visitors Management</h2>
            
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstname" value={newVisitor.firstname} onChange={handleChange} placeholder="First Name" required />
                <input type="text" name="lastname" value={newVisitor.lastname} onChange={handleChange} placeholder="Last Name" required />
                <input type="text" name="phone" value={newVisitor.phone} onChange={handleChange} placeholder="Phone Number" required />
                
                <select name="gender" value={newVisitor.gender} onChange={handleChange} required>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>

                <label>
                    <input type="checkbox" name="want_to_be_member" checked={newVisitor.want_to_be_member} onChange={handleChange} />
                    Want to be a member?
                </label>
                <label>
                    <input type="checkbox" name="would_like_visit" checked={newVisitor.would_like_visit} onChange={handleChange} />
                    Would like a visit?
                </label>

                <button type="submit">{editingVisitor ? "Update" : "Add"} Visitor</button>
            </form>

            <h3>Visitor List</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {visitors.map((visitor) => (
                        <tr key={visitor.id}>
                            <td>{visitor.firstname} {visitor.lastname}</td>
                            <td>{visitor.phone}</td>
                            <td>{visitor.gender}</td>
                            <td>
                                <button onClick={() => handleEdit(visitor)}>Edit</button>
                                <button onClick={() => handleDelete(visitor.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Visitors;
