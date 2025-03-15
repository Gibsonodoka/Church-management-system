import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faChartPie, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

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

    // Helper function to calculate monthly attendance for each demographic
    const getMonthlyAttendance = (month, service) => {
        const filteredRecords = attendanceRecords.filter((record) => {
            const recordMonth = moment(record.date).format("MMMM YYYY");
            const matchesMonth = month ? recordMonth === month : true;
            const matchesService = service ? record.service_description === service : true;
            return matchesMonth && matchesService;
        });

        const demographics = ["men", "women", "youth", "teens", "children"];
        return demographics.map((category) =>
            filteredRecords.reduce((sum, record) => sum + (parseInt(record[category]) || 0), 0)
        );
    };

    // Helper function to calculate the monthly target based on service type
    const getMonthlyTarget = (service) => {
        return service === "Sunday Service" ? 2000 : 800;
    };

    // Data for the horizontal progress bar chart
    const progressBarData = {
        labels: ["Men", "Women", "Youth", "Teens", "Children"],
        datasets: [
            {
                label: "Current Attendance",
                data: getMonthlyAttendance(selectedMonth, selectedService), // Actual attendance
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Remaining to Target",
                data: getMonthlyAttendance(selectedMonth, selectedService).map(
                    (attendance) => getMonthlyTarget(selectedService) - attendance
                ), // Remaining to target
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    // Filter data for the "Total Attendance Per Week" chart based on selected month and service
    const filteredDataForBarChart = attendanceRecords.filter((record) => {
        const recordMonth = moment(record.date).format("MMMM YYYY");
        const matchesMonth = selectedMonth ? recordMonth === selectedMonth : true;
        const matchesService = selectedService ? record.service_description === selectedService : true;
        return matchesMonth && matchesService;
    });

    // Group filtered data by week for the "Total Attendance Per Week" chart
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

    // Data for the pie chart (attendance per month by demographic)
    const pieChartData = {
        labels: ["Men", "Women", "Youth", "Teens", "Children"],
        datasets: [
            {
                data: [
                    attendanceRecords.reduce((sum, record) => sum + (parseInt(record.men) || 0), 0),
                    attendanceRecords.reduce((sum, record) => sum + (parseInt(record.women) || 0), 0),
                    attendanceRecords.reduce((sum, record) => sum + (parseInt(record.youth) || 0), 0),
                    attendanceRecords.reduce((sum, record) => sum + (parseInt(record.teens) || 0), 0),
                    attendanceRecords.reduce((sum, record) => sum + (parseInt(record.children) || 0), 0),
                ],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
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

            {/* New Row for Pie Chart and Progress Bar Chart */}
            <div className="row">
                {/* Pie Chart: Attendance Per Month by Demographic */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                <FontAwesomeIcon icon={faChartPie} className="me-2" />
                                Attendance Per Month by Demographic
                            </h4>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Progress Bar Chart: Monthly Attendance Progress */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                                Monthly Attendance Progress
                            </h4>
                            <div className="d-flex gap-3 mt-2">
                                {/* Month Dropdown */}
                                <select
                                    className="form-select"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="">Select Month</option>
                                    {uniqueMonths.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>

                                {/* Service Type Dropdown */}
                                <select
                                    className="form-select"
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
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
                                data={progressBarData}
                                options={{
                                    indexAxis: "y", // Horizontal bar chart
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            stacked: true, // Stacked bars
                                            beginAtZero: true,
                                            max: getMonthlyTarget(selectedService), // Set max value to target
                                        },
                                        y: {
                                            stacked: true, // Stacked bars
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