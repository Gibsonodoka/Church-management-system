import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartComponent from "../components/ChartComponent"; 
import VisitorsTable from "../components/VisitorsTable"; 
import axios from "axios";
import CountUp from "react-countup";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    members: 0,
    visitors: 0, // This will hold the total number of visitors
    inventory: 0,
    departments: 0,
    finance: 0,
    events: 0,
    daughterChurches: 0,
    attendance: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState([]); // State for recent visitors

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

      // Fetch dashboard stats
      axios
        .get("http://127.0.0.1:8000/api/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setStats(response.data); // Update stats, including visitors count
        })
        .catch((error) => {
          console.error("Error fetching dashboard stats:", error);
        });

      // Fetch recent visitors
      axios
        .get("http://127.0.0.1:8000/api/visitors/recent", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setRecentVisitors(response.data);
        })
        .catch((error) => {
          console.error("Error fetching recent visitors:", error);
        });

      // Fetch total visitors count (if not included in dashboard-stats)
      axios
        .get("http://127.0.0.1:8000/api/visitors/count", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setStats((prevStats) => ({
            ...prevStats,
            visitors: response.data.totalVisitors, // Update visitors count
          }));
        })
        .catch((error) => {
          console.error("Error fetching total visitors count:", error);
        });
    }
  }, [navigate]);

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
              <h1 className="mt-4">Dashboard</h1>
              <p>Welcome {user ? user.name : "Loading..."} to Our Church Management System</p>

              <div className="row">
                {[
                  { 
                    title: "Church Members", 
                    count: stats.members, 
                    color: "bg-primary text-white", 
                    icon: "fas fa-users", 
                    route: "/members" 
                  },
                  { title: "Visitors", count: stats.visitors, color: "bg-success text-white", icon: "fas fa-user-plus" ,  route: "/visitors"},
                  { title: "Church Inventory", count: stats.inventory, color: "bg-warning text-white", icon: "fas fa-box" },
                  { title: "Departments", count: stats.departments, color: "bg-danger text-white", icon: "fas fa-building" },
                  { title: "Finance", count: stats.finance, color: "bg-info text-white", icon: "fas fa-wallet" },
                  { title: "Events", count: stats.events, color: "bg-secondary text-white", icon: "fas fa-calendar-alt" },
                  { title: "Daughter Churches", count: stats.daughterChurches, color: "bg-dark text-white", icon: "fas fa-church" },
                  { title: "Attendance System", count: stats.attendance, color: "bg-light text-dark", icon: "fas fa-clipboard-list" },
                ].map((card, index) => (
                  <div key={index} className="col-xl-3 col-md-6">
                    <div 
                      className={`card ${card.color} mb-4`} 
                      onClick={() => card.route && navigate(card.route)} 
                      style={{ cursor: card.route ? "pointer" : "default" }}
                    >
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div>
                          <h5>{card.title}</h5>
                          <h3>
                            <CountUp 
                              key={card.count} // Forces re-render when count updates
                              start={0} 
                              end={card.count} 
                              duration={2} 
                              separator="," 
                            />
                          </h3>
                        </div>
                        <i className={`${card.icon} fa-2x`}></i>
                      </div>
                      <div className="card-footer d-flex align-items-center justify-content-between">
                        <span className={`small ${card.color.includes("bg-light") ? "text-dark" : "text-white"} stretched-link`}>
                          {card.route ? "View Details" : ""}
                        </span>
                        <div className={`small ${card.color.includes("bg-light") ? "text-dark" : "text-white"}`}>
                          <i className="fas fa-angle-right"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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
                  <div className="card mb-4">
                    <div className="card-header">
                      <i className="fas fa-table me-1"></i> Recent Visitors
                    </div>
                    <div className="card-body">
                      <VisitorsTable visitors={recentVisitors} /> {/* Pass recent visitors data */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;