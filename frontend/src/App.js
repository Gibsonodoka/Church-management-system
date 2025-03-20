import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard"; // Updated import
import Users from "./pages/admin/Users"; // Updated import
import Members from "./pages/admin/Members"; // Updated import
import Visitors from "./pages/admin/Visitors"; // Updated import
import Attendance from "./pages/admin/Attendance"; // Updated import
import Departments from "./pages/admin/Departments"; // Updated import

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Common pages (not role-specific) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin-specific pages */}
        <Route path="/admin/dashboard" element={<Dashboard />} /> {/* Updated path */}
        <Route path="/admin/users" element={<Users />} /> {/* Updated path */}
        <Route path="/admin/members" element={<Members />} /> {/* Updated path */}
        <Route path="/admin/visitors" element={<Visitors />} /> {/* Updated path */}
        <Route path="/admin/attendance" element={<Attendance />} /> {/* Updated path */}
        <Route path="/admin/departments" element={<Departments />} /> {/* Updated path */}
      </Routes>
    </Router>
  );
}

export default App;