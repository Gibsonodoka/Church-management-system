import React, { useState } from "react";
import { Bar } from "react-chartjs-2"; // Only Bar chart is needed now
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChartBar } from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = ({ attendanceRecords }) => {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedService, setSelectedService] = useState("");

    // Helper function to group data by week for a specific month
    const groupByWeek = (data, month) => {
        const grouped = {};
        data.forEach((record) => {
            const recordMonth = moment(record.date).format("MMMM YYYY");
            if (recordMonth === month) {
                // Group by week starting on Sunday
                const weekStart = moment(record.date).startOf("week").format("DD MMM");
                const weekEnd = moment(record.date).endOf("week").format("DD MMM");
                const weekLabel = `Week ${moment(record.date).week()} (${weekStart} - ${weekEnd})`;
                if (!grouped[weekLabel]) {
                    grouped[weekLabel] = 0;
                }
                grouped[weekLabel] += parseInt(record.total) || 0;
            }
        });
        return grouped;
    };

    // Get unique months from attendance records
    const uniqueMonths = [...new Set(attendanceRecords.map((record) => moment(record.date).format("MMMM YYYY")))];

    // Get unique service types from attendance records
    const uniqueServices = [...new Set(attendanceRecords.map((record) => record.service_description))];

    // Filter data for the "Total Attendance Over Time" chart based on selected month and service
    const filteredDataForBarChart = attendanceRecords.filter((record) => {
        const recordMonth = moment(record.date).format("MMMM YYYY");
        const matchesMonth = selectedMonth ? recordMonth === selectedMonth : true;
        const matchesService = selectedService ? record.service_description === selectedService : true;
        return matchesMonth && matchesService;
    });

    // Group filtered data by week for the "Total Attendance Over Time" chart
    const weeklyDataForBarChart = groupByWeek(filteredDataForBarChart, selectedMonth);
    const weeksForBarChart = Object.keys(weeklyDataForBarChart);
    const totalsForBarChart = weeksForBarChart.map((week) => weeklyDataForBarChart[week]);

    // Data for the bar chart (total attendance per week)
    const barChartData = {
        labels: weeksForBarChart,
        datasets: [
            {
                label: "Total Attendance",
                data: totalsForBarChart,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    // Function to get total counts for each demographic category
    const getDemographicData = (category) => {
        return uniqueMonths.map((month) =>
            attendanceRecords
                .filter((record) => moment(record.date).format("MMMM YYYY") === month)
                .reduce((sum, record) => sum + (parseInt(record[category]) || 0), 0)
        );
    };

    // Data for the second bar chart (demographic breakdown)
    const demographicBarChartData = {
        labels: uniqueMonths, // Show all months for demographic breakdown
        datasets: [
            {
                label: "Men",
                data: getDemographicData("men"),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "Women",
                data: getDemographicData("women"),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
                label: "Youth",
                data: getDemographicData("youth"),
                backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
            {
                label: "Teens",
                data: getDemographicData("teens"),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Children",
                data: getDemographicData("children"),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
        ],
    };

    return (
        <div className="mt-5">
            <h2>Attendance Analytics</h2>

            <div className="row">
                {/* Bar Chart: Total Attendance Per Week */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                <FontAwesomeIcon icon={faChartBar} className="me-2" />
                                Total Attendance Per Week
                            </h4>
                            <div className="d-flex gap-3 mt-2">
                                {/* Month Dropdown */}
                                <select className="form-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    <option value="">Select Month</option>
                                    {uniqueMonths.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>

                                {/* Service Type Dropdown */}
                                <select className="form-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                    <option value="">All Services</option>
                                    {uniqueServices.map((service) => (
                                        <option key={service} value={service}>
                                            {service}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <Bar
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Demographic Breakdown */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                <FontAwesomeIcon icon={faChartBar} className="me-2" />
                                Demographic Breakdown
                            </h4>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <Bar
                                data={demographicBarChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;