import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartComponent from "../components/ChartComponent"; 
import VisitorsTable from "../components/VisitorsTable"; 
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    members: 0,
    visitors: 0,
    inventory: 0,
    departments: 0,
    finance: 0,
    events: 0,
    daughterChurches: 0,
    attendance: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
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

      // Fetch Dashboard Statistics
      axios
        .get("http://127.0.0.1:8000/api/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setStats(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboard stats:", error);
        });
    }
  }, [navigate]);

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
              <h1 className="mt-4">Dashboard</h1>
              <p>Welcome {user ? user.name : "Loading..."} to Our Church Management System</p>

              {/* Dashboard Cards with Icons */}
              <div className="row">
                {[
                  { title: "Church Members", count: stats.members, color: "bg-primary text-white", icon: "fas fa-users" },
                  { title: "Visitors", count: stats.visitors, color: "bg-success text-white", icon: "fas fa-user-plus" },
                  { title: "Church Inventory", count: stats.inventory, color: "bg-warning text-white", icon: "fas fa-box" },
                  { title: "Departments", count: stats.departments, color: "bg-danger text-white", icon: "fas fa-building" },
                  { title: "Finance", count: stats.finance, color: "bg-info text-white", icon: "fas fa-wallet" },
                  { title: "Events", count: stats.events, color: "bg-secondary text-white", icon: "fas fa-calendar-alt" },
                  { title: "Daughter Churches", count: stats.daughterChurches, color: "bg-dark text-white", icon: "fas fa-church" },
                  { title: "Attendance System", count: stats.attendance, color: "bg-light text-dark", icon: "fas fa-clipboard-list" },
                ].map((card, index) => (
                  <div key={index} className="col-xl-3 col-md-6">
                    <div className={`card ${card.color} mb-4`}>
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div>
                          <h5>{card.title}</h5>
                          <h3>{card.count}</h3> {/* Display the count */}
                        </div>
                        <i className={`${card.icon} fa-2x`}></i>
                      </div>
                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <a className={`small ${card.color.includes("bg-light") ? "text-dark" : "text-white"} stretched-link`} href="#">View Details</a>
                        <div className={`small ${card.color.includes("bg-light") ? "text-dark" : "text-white"}`}>
                          <i className="fas fa-angle-right"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="row">
                <div className="col-xl-6">
                  <div className="card mb-4">
                    <div className="card-header">
                      <i className="fas fa-chart-bar me-1"></i> Weekly Attendance
                    </div>
                    <div className="card-body" style={{ height: "350px" }}>
                      <ChartComponent chartType="bar" />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <div className="card mb-4">
                    <div className="card-header">
                      <i className="fas fa-chart-pie me-1"></i> Church Demographics
                    </div>
                    <div className="card-body" style={{ height: "350px" }}>
                      <ChartComponent chartType="pie" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Area Chart & Visitors Table */}
              <div className="row">
                <div className="col-xl-6">
                  <div className="card mb-4">
                    <div className="card-header">
                      <i className="fas fa-chart-area me-1"></i> Church Growth - New Members Added
                    </div>
                    <div className="card-body" style={{ height: "350px" }}>
                      <ChartComponent chartType="area" />
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <VisitorsTable />
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

export default Dashboard;
