import React, { useState } from "react";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  plugins,
  scales,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Report(props) {
  const [reportType, setReportType] = React.useState("By category");
  const [loading, setLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState(null);
  const [dateFrom, setDateFrom] = React.useState("2025-01-01");
  const [dateTo, setDateTo] = React.useState("2025-03-31");
  const [buttonType, setButtonType] = useState("Summary");

  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch data whenever reportType, dateFrom, or dateTo changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    fetchReportData();
  }, [reportType, dateFrom, dateTo]);
  
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (reportType === "By category") {
        setChartData({
          labels: [
            "Food",
            "Transport",
            "Bills",
            "Shopping",
            "Entertainment",
            "Other",
          ],
          datasets: [
            {
              label: "Expenses by Category",
              data: [350, 150, 280, 200, 120, 80],
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      } else if (reportType === "Monthly Trend") {
        setChartData({
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Monthly Expenses",
              data: [750, 820, 880, 790, 850, 910],
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.5)",
              tension: 0.3,
            },
          ],
        });
      } else if (reportType === "Weekly Trend") {
        setChartData({
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Weekly Expenses",
              data: [210, 280, 190, 240],
              backgroundColor: "rgba(99, 102, 241, 0.5)",
              borderColor: "rgb(99, 102, 241)",
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChart = (chart) => {
    if (chart) {
      chartInstanceRef.current = chart;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: true,
        labels: {
          boxWidth: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: `Expense Report (${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        })`,
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        }
      },
    },
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">Loading...</div>
      );
    }

    if (!chartData) {
      return (
        <div className="flex items-center justify-center h-64">
          No data available
        </div>
      );
    }

    switch (reportType) {
      case "By category":
        return <Pie ref={getChart} data={chartData} options={chartOptions} />;
      case "Monthly Trend":
        return <Line ref={getChart} data={chartData} options={chartOptions} />;
      case "Weekly Trend":
        return <Bar ref={getChart} data={chartData} options={chartOptions} />;
      default:
        return <Pie ref={getChart} data={chartData} options={chartOptions} />;
    }
  };

  const reportData = {
    labels: [
      "Food",
      "Transport",
      "Bills",
      "Shopping",
      "Entertainment",
      "Other",
    ],
    datasets: [
      {
        label: "Previous Month",
        data: [320, 140, 280, 180, 150, 70],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: "Current Month",
        data: [350, 150, 280, 200, 120, 80],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgb(153, 102, 255)",
        borderWidth: 1,
      },
    ],
  };

  const reportOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: "Month-to-Month Comparison",
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  const renderReport = () => {
    switch (buttonType) {
      case "Summary":
        return (
          <div>
            <div className="font-semibold text-xl md:text-2xl">Expense Summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Total Expenses</div>
                <div className="font-bold text-xl md:text-2xl">$1,180.00</div>
              </div>
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Average Daily</div>
                <div className="font-bold text-xl md:text-2xl">$39.33</div>
              </div>
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Highest Expense</div>
                <div className="font-bold text-xl md:text-2xl">$280.00</div>
                <div className="text-gray-500 text-sm md:text-base">Bills (Rent)</div>
              </div>
            </div>
          </div>
        );
      case "Comparision":
        return (
          <div>
            <div className="font-semibold text-xl md:text-2xl">
              Month-to-Month Comparison
            </div>
            <div className="h-64 mt-4">
              <Bar data={reportData} options={reportOptions} />
            </div>
          </div>
        );
      case "Insights":
        return (
          <div>
            <div className="font-semibold text-xl md:text-2xl">Spending Insights</div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="rounded-md p-4 bg-gray-100">
                <div className="font-semibold text-sm md:text-base">Top Spending Category</div>
                <div className="font-bold text-xl md:text-2xl">Food ($350.00)</div>
                <div className="text-gray-500 text-sm md:text-base">29.7% of total expenses</div>
              </div>
              <div className="rounded-md p-4 bg-gray-100">
                <div className="font-semibold text-sm md:text-base">Unusual Spending</div>
                <div className="font-bold text-xl md:text-2xl">Shopping increased by 11%</div>
                <div className="text-gray-500 text-sm md:text-base">Compared to your monthly average</div>
              </div>
              <div className="rounded-md p-4 bg-gray-100">
                <div className="font-semibold text-sm md:text-base">Saving Opportunity</div>
                <div className="font-bold text-xl md:text-2xl">Entertainment ($120.00)</div>
                <div className="text-gray-500 text-sm md:text-base">Consider reducing to meet your savings goal</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div className="font-semibold text-xl md:text-2xl">Expense Summary</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Total Expenses</div>
                <div className="font-bold text-xl md:text-2xl">$1,180.00</div>
              </div>
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Average Daily</div>
                <div className="font-bold text-xl md:text-2xl">$39.33</div>
              </div>
              <div className="rounded-md bg-gray-100 p-4">
                <div className="text-gray-500 text-sm md:text-base">Highest Expense</div>
                <div className="font-bold text-xl md:text-2xl">$280.00</div>
                <div className="text-gray-500 text-sm md:text-base">Bills (Rent)</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full px-2 md:pl-5">
      <div className="flex flex-col">
        <div className="border rounded-md p-4 md:p-6">
          <div className="font-semibold text-xl md:text-2xl">Expense Reports</div>
          <div className="text-sm md:text-base text-gray-500">
            Visualize your spending patterns
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="date"
                className="border rounded-md p-2 text-sm w-full"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="text-sm">to</span>
              <input
                type="date"
                className="border rounded-md p-2 text-sm w-full"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <select
              id="category"
              className="border rounded-md p-2 text-sm w-full md:w-auto mt-2 md:mt-0"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="By category">By category</option>
              <option value="Monthly Trend">Monthly Trend</option>
              <option value="Weekly Trend">Weekly Trend</option>
            </select>
          </div>
          
          <div className="h-64 md:h-80 mt-6">{renderChart()}</div>
        </div>
        
        <div className="grid grid-cols-3 w-full rounded-md mt-4 bg-gray-100">
          <button
            value="Summary"
            className={`rounded-md py-2 px-1 md:px-2 m-1 text-sm md:text-base ${
              buttonType === "Summary" ? "bg-white" : "text-gray-500"
            }`}
            onClick={(e) => setButtonType(e.target.value)}
          >
            Summary
          </button>
          <button
            value="Comparision"
            className={`rounded-md py-2 px-1 md:px-2 m-1 text-sm md:text-base ${
              buttonType === "Comparision" ? "bg-white" : "text-gray-500"
            }`}
            onClick={(e) => setButtonType(e.target.value)}
          >
            Comparison
          </button>
          <button
            value="Insights"
            className={`rounded-md py-2 px-1 md:px-2 m-1 text-sm md:text-base ${
              buttonType === "Insights" ? "bg-white" : "text-gray-500"
            }`}
            onClick={(e) => setButtonType(e.target.value)}
          >
            Insights
          </button>
        </div>
        
        <div className="border rounded-md p-4 md:p-6 mt-4">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}

export default Report;