import React from "react";
import { Bar, Line } from "react-chartjs-2";
import moment from "moment";

const Analytics = ({ attendanceRecords }) => {
    // Helper function to group data by month
    const groupByMonth = (data) => {
        const grouped = {};
        data.forEach((record) => {
            const month = moment(record.date).format("MMMM YYYY");
            if (!grouped[month]) {
                grouped[month] = {
                    total: 0,
                    men: 0,
                    women: 0,
                    youth: 0,
                    teens: 0,
                    children: 0,
                };
            }
            grouped[month].total += parseInt(record.total);
            grouped[month].men += parseInt(record.men);
            grouped[month].women += parseInt(record.women);
            grouped[month].youth += parseInt(record.youth);
            grouped[month].teens += parseInt(record.teens);
            grouped[month].children += parseInt(record.children);
        });
        return grouped;
    };

    // Group attendance data by month
    const monthlyData = groupByMonth(attendanceRecords);
    const months = Object.keys(monthlyData);
    const totals = months.map((month) => monthlyData[month].total);

    // Data for the line chart (total attendance over time)
    const lineChartData = {
        labels: months,
        datasets: [
            {
                label: "Total Attendance",
                data: totals,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    // Data for the bar chart (demographic breakdown)
    const barChartData = {
        labels: months,
        datasets: [
            {
                label: "Men",
                data: months.map((month) => monthlyData[month].men),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "Women",
                data: months.map((month) => monthlyData[month].women),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
                label: "Youth",
                data: months.map((month) => monthlyData[month].youth),
                backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
            {
                label: "Teens",
                data: months.map((month) => monthlyData[month].teens),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Children",
                data: months.map((month) => monthlyData[month].children),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
        ],
    };

    return (
        <div className="mt-5">
            <h2>Attendance Analytics</h2>

            {/* Line Chart: Total Attendance Over Time */}
            <div className="mb-5">
                <h4>Total Attendance Over Time</h4>
                <Line
                    data={lineChartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            {/* Bar Chart: Demographic Breakdown */}
            <div className="mb-5">
                <h4>Demographic Breakdown</h4>
                <Bar
                    data={barChartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default Analytics;