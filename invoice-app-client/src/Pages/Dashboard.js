import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'tailwindcss/tailwind.css';
import './Dashboard.css';

const Dashboard = () => {
    let salesPieChart;
    let topCustomersBarChart;
    let servicesChart;
    let servicesByPeriodChart;

    const services = ['Service A', 'Service B', 'Service C', 'Service D', 'Service E'];
    const invoiceData = [5000, 3000, 4000, 7000, 2000];
    const receiptData = [2000, 1500, 3000, 4000, 1500];
    const outstandingData = [3000, 1500, 1000, 3000, 500];

    // Function to initialize charts
    const createServicesChart = (services, invoiceData, receiptData, outstandingData) => {
        const ctx = document.getElementById('servicesChart').getContext('2d');
        if (servicesChart)
            servicesChart.destroy();
        servicesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: services,
                datasets: [
                    {
                        label: 'Invoice Amount',
                        data: invoiceData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    },
                    {
                        label: 'Receipt Amount',
                        data: receiptData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                    {
                        label: 'Outstanding',
                        data: outstandingData,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Services',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount',
                        },
                    }
                }
            }
        });
    };

    const createSalesPieChart = () => {
        const ctx = document.getElementById('salesPieChart').getContext('2d');

        if (salesPieChart) {
            salesPieChart.destroy();
        }

        salesPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['SMM', 'SEO', 'G-Suite'],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ['#007bff', '#28a745', '#ffc107'],
                        hoverBackgroundColor: ['#0056b3', '#218838', '#e0a800'],
                        hoverBorderColor: ['#004085', '#155724', '#856404'],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    };

    const createTopCustomersBarChart = () => {
        const ctx = document.getElementById('topCustomersBarChart').getContext('2d');
        if (topCustomersBarChart)
            topCustomersBarChart.destroy();
        topCustomersBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Customer 1', 'Customer 2', 'Customer 3', 'Customer 4', 'Customer 5'],
                datasets: [{
                    label: 'Transaction Amount',
                    data: [1000, 2000, 3000, 4000, 5000],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Customers'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Transaction Amount'
                        }
                    }
                }
            }
        });
    };

    const createServicesByPeriodChart = () => {
        const ctx = document.getElementById('servicesByPeriodChart').getContext('2d');
        if (servicesByPeriodChart)
            servicesByPeriodChart.destroy();
        servicesByPeriodChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Service A', 'Service B', 'Service C', 'Service D'],
                datasets: [
                    {
                        label: 'Invoice Amount - Jan',
                        data: [1200, 1500, 800, 1300],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Service Count - Jan',
                        data: [12, 19, 3, 5],
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        stack: 'Stack 1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Services'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (Invoice) / Count (Services)'
                        },
                        stacked: true
                    }
                }
            }
        });
    };

    useEffect(() => {
        createServicesChart(services, invoiceData, receiptData, outstandingData);
        createSalesPieChart();
        createTopCustomersBarChart();
        createServicesByPeriodChart();
    }, []);

    return (
        <div>
            <div className="container mx-auto mt-4">
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold mr-4">Dashboard for financial year</h1>
                    <select id="financialYear" className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700">
                        <option value="2022-2023">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2022-2023</option>
                    </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow-lg p-4 hover:bg-blue-50 hover:shadow-xl transition duration-300">
                        <div className="text-gray-500">Sales</div>
                        <h2 className="text-3xl font-bold text-blue-600">₹0</h2>
                        <p className="text-gray-400 text-sm">Current Financial Year, Updated 5s ago</p>
                    </div>
                    {/* Other Cards */}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <canvas id="servicesChart" width="400" height="200"></canvas>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <canvas id="salesPieChart" width="400" height="200"></canvas>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <canvas id="topCustomersBarChart" width="400" height="200"></canvas>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <canvas id="servicesByPeriodChart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
