import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChartComponent from "../components/ChartComponent"; // Import Chart Component

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
              <p>Welcome to the Our Church Management System</p>

              {/* Dashboard Cards */}
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white mb-4">
                    <div className="card-body">Church Members</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-success text-white mb-4">
                    <div className="card-body">Visitors</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-warning text-white mb-4">
                    <div className="card-body">Church Inventory</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-danger text-white mb-4">
                    <div className="card-body">Departments</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-info text-white mb-4">
                    <div className="card-body">Finance</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-secondary text-white mb-4">
                    <div className="card-body">Events</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-dark text-white mb-4">
                    <div className="card-body">Daughter Churches</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View Details</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6">
                  <div className="card bg-light text-dark mb-4">
                    <div className="card-body">Attendance System</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-dark stretched-link" href="#">View Details</a>
                      <div className="small text-dark"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <ChartComponent />

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
