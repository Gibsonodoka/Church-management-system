import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Members from "./pages/Members"; // Import Members page
import Visitors from "./pages/Visitors";
import Attendance from "./pages/Attendance";
import Departments from "./pages/Departments";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/members" element={<Members />} /> {/* Added Members page */}
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/departments" element={<Departments />} />
      </Routes>
    </Router>
  );
}

export default App;
