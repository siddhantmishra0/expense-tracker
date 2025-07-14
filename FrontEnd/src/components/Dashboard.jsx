import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, DollarSign, TrendingDown } from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [budgetPercentage, setBudgetPercentage] = useState(71);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Track window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const CategoryData = {
    labels: ["Food", "Transport", "Bills", "Shopping", "Other"],
    datasets: [
      {
        label: "Expenses by Category",
        data: [350, 150, 200, 100, 50],
        backgroundColor: [
          "rgb(255, 153, 153)",
          "rgb(153, 204, 255)",
          "rgb(255, 229, 153)",
          "rgb(153, 221, 221)",
          "rgb(204, 153, 255)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const MonthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Expenses",
        data: [1200, 1500, 800, 2000, 1700, 2200],
        fill: false,
        backgroundColor: "rgb(102, 102, 255)",
        borderColor: "rgb(102, 102, 255)",
      },
    ],
  };

  // Responsive chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: windowWidth < 768 ? 'bottom' : 'top',
        labels: {
          boxWidth: windowWidth < 768 ? 10 : 40,
          font: {
            size: windowWidth < 768 ? 10 : 12
          }
        }
      }
    }
  };

  const statCards = [
    {
      title: "Total Expenses",
      value: "$2450.75",
      description: "All time expenses",
      symbol: <DollarSign className="text-blue-500" />,
    },
    {
      title: "Monthly Expenses",
      value: "$850.25",
      description: "Current month",
      symbol: <Calendar className="text-purple-500" />,
    },
    {
      title: "Monthly Budget",
      value: "$1200.00",
      description: "Target Spending",
      symbol: <TrendingUp className="text-orange-500" />,
    },
    {
      title: "Remaining Budget",
      value: <div className="text-green-500">$349.75</div>,
      description: (
        <p className="text-xs text-muted-foreground mt-1">
          {isOverBudget
            ? "Over budget"
            : `${budgetPercentage.toFixed(0)}% of budget used`}
        </p>
      ),
      symbol: isOverBudget ? (
        <TrendingDown className="text-red-500" />
      ) : (
        <TrendingUp className="text-green-500" />
      ),
      bar: (
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              isOverBudget ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full ml-5">
      {/* Stat Cards - Grid layout for better responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="border-2 p-4 rounded-lg shadow-sm flex flex-col justify-between h-40"
          >
            <div className="flex flex-row items-center justify-between mb-2">
              <div className="font-semibold text-sm md:text-base">{card.title}</div>
              <div>{card.symbol}</div>
            </div>
            <div className="font-bold text-xl md:text-2xl">{card.value}</div>
            <div>{card.bar}</div>
            <div className="text-xs text-gray-600">{card.description}</div>
          </div>
        ))}
      </div>

      {/* Charts - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Monthly Trend Chart */}
        <div className="border-2 p-4 md:p-6 rounded-lg shadow-sm">
          <div className="font-bold text-lg md:text-xl mb-1 md:mb-2">Monthly Trend</div>
          <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">
            Your expense trend over the last 6 months
          </div>
          <div className="h-60 md:h-72">
            <Line data={MonthlyData} options={chartOptions} />
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="border-2 p-4 md:p-6 rounded-lg shadow-sm">
          <div className="font-bold text-lg md:text-xl mb-1 md:mb-2">Expense Categories</div>
          <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">
            Breakdown of your current month's expenses
          </div>
          <div className="h-60 md:h-72">
            <Pie data={CategoryData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;