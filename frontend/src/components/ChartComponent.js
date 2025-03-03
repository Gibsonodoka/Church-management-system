import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartComponent = () => {
  // Bar Chart Data
  const barData = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Attendance",
        data: [50, 75, 40, 90, 60, 80, 100],
        backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745", "#6610f2", "#fd7e14", "#20c997"],
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: ["Men", "Women", "Children"],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: ["#007bff", "#dc3545", "#ffc107"],
      },
    ],
  };

  // Chart Options (Make Pie Chart Same Height as Bar Chart)
  const chartOptions = {
    maintainAspectRatio: false, // Allows custom height
    responsive: true,
  };

  return (
    <div className="row">
      {/* Bar Chart */}
      <div className="col-xl-6">
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-chart-bar me-1"></i> Weekly Attendance
          </div>
          <div className="card-body" style={{ height: "350px" }}> {/* Reduced height */}
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Pie Chart (Same Height as Bar Chart) */}
      <div className="col-xl-6">
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-chart-pie me-1"></i> Church Demographics
          </div>
          <div className="card-body" style={{ height: "350px" }}> {/* Reduced height */}
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
