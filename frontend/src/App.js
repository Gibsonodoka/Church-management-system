import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Members from "./pages/Members"; // Import Members page
import Visitors from "./pages/Visitors";

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
      </Routes>
    </Router>
  );
}

export default App;
