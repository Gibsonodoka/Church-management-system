import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartComponent from "../components/ChartComponent"; 
import VisitorsTable from "../components/VisitorsTable"; // Keep Visitors Table

const Dashboard = () => {
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
              <p>Welcome to Our Church Management System</p>

              {/* Dashboard Cards with Icons */}
              <div className="row">
                {[
                  { title: "Church Members", color: "bg-primary text-white", icon: "fas fa-users" },
                  { title: "Visitors", color: "bg-success text-white", icon: "fas fa-user-plus" },
                  { title: "Church Inventory", color: "bg-warning text-white", icon: "fas fa-box" },
                  { title: "Departments", color: "bg-danger text-white", icon: "fas fa-building" },
                  { title: "Finance", color: "bg-info text-white", icon: "fas fa-wallet" },
                  { title: "Events", color: "bg-secondary text-white", icon: "fas fa-calendar-alt" },
                  { title: "Daughter Churches", color: "bg-dark text-white", icon: "fas fa-church" },
                  { title: "Attendance System", color: "bg-light text-dark", icon: "fas fa-clipboard-list" }, // Fixed styling here
                ].map((card, index) => (
                  <div key={index} className="col-xl-3 col-md-6">
                    <div className={`card ${card.color} mb-4`}>
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div>{card.title}</div>
                        <i className={`${card.icon} fa-2x`}></i> {/* Icon */}
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

              {/* Charts (NO DUPLICATES) */}
              <div className="row">
                {/* Bar Chart (Weekly Attendance) */}
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

                {/* Pie Chart (Church Demographics) */}
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

              {/* Area Chart & Visitors Table Side by Side */}
              <div className="row">
                {/* Area Chart (Church Growth) */}
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

                {/* Visitors Table */}
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
