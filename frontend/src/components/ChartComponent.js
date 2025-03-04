import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ChartComponent = ({ chartType }) => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.canvas.getContext("2d");

      // Create a gradient
      const newGradient = ctx.createLinearGradient(0, 0, 0, 400);
      newGradient.addColorStop(0, "rgba(0, 123, 255, 0.6)"); // Darker blue at the top
      newGradient.addColorStop(1, "rgba(0, 123, 255, 0)"); // Transparent at the bottom

      setGradient(newGradient);
    }
  }, []);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const chartData = {
    bar: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [
        {
          label: "Attendance",
          data: [50, 75, 40, 90, 60, 80, 100],
          backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745", "#6610f2", "#fd7e14", "#20c997"],
        },
      ],
    },
    pie: {
      labels: ["Men", "Women", "Children"],
      datasets: [
        {
          data: [30, 45, 25],
          backgroundColor: ["#007bff", "#dc3545", "#ffc107"],
        },
      ],
    },
    area: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "New Members",
          data: [5, 10, 15, 20, 18, 25, 30, 28, 35, 40, 38, 50],
          fill: true,
          backgroundColor: gradient || "rgba(0, 123, 255, 0.2)", // Fallback if gradient is not set yet
          borderColor: "#007bff",
          tension: 0.4,
        },
      ],
    },
  };

  switch (chartType) {
    case "bar":
      return <Bar data={chartData.bar} options={chartOptions} />;
    case "pie":
      return <Pie data={chartData.pie} options={chartOptions} />;
    case "area":
      return <Line ref={chartRef} data={chartData.area} options={chartOptions} />;
    default:
      return null;
  }
};

export default ChartComponent;
