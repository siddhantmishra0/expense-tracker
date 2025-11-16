import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  TrendingDown,
  Wallet,
} from "lucide-react";
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
import axios from "axios";

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
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  // Track window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/login", {
        withCredentials: true,
      })
      .then((response) => setUserId(response.data.user._id))
      .catch((error) => {
        console.log("Fetch error: ", error);
        window.location.href = "/";
      });
  }, []);

  const fetchExpenses = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/home/expense?userId=${userId}`,
        { withCredentials: true }
      );
      setExpenses(res.data);
    } catch (error) {
      console.log("Error while fetching expenses ", error);
    }
  };

  const fetchBudget = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/home/budget?userId=${userId}`,
        { withCredentials: true }
      );
      setBudget(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log("Error while fetching budgets ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      Promise.all([fetchExpenses(), fetchBudget()]).finally(() => {
        setLoading(false);
      });
    }
  }, [userId]);

  // Calculate total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate current month expenses
  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        // console.log(expense.date);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate total budget
  const getTotalBudget = () => {
    if (budget.length > 0) {
      const overallBudget = budget.find(
        (budgetItem) => budgetItem.category === "Overall"
      );
      // console.log(overallBudget);

      return overallBudget ? overallBudget.amount : 0;
    } else {
      return 0;
    }
  };

  // Calculate remaining budget
  const getRemainingBudget = () => {
    const totalBudget = getTotalBudget();
    const totalExpenses = getTotalExpenses();
    return totalBudget - totalExpenses;
  };

  // Calculate budget percentage
  const getBudgetPercentage = () => {
    const totalBudget = getTotalBudget();
    const totalExpenses = getTotalExpenses();
    if (totalBudget === 0) return 0;
    return (totalExpenses / totalBudget) * 100;
  };

  // Check if over budget
  const isOverBudget = getRemainingBudget() <= 0;
  const budgetPercentage = getBudgetPercentage();

  // Generate category data for pie chart
  const getCategoryData = () => {
    const categoryTotals = {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter expenses for current month
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // Calculate totals by category
    currentMonthExpenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Colors for different categories
    const colors = [
      "rgb(255, 153, 153)", // Light red
      "rgb(153, 204, 255)", // Light blue
      "rgb(255, 229, 153)", // Light yellow
      "rgb(153, 221, 221)", // Light cyan
      "rgb(204, 153, 255)", // Light purple
      "rgb(255, 204, 153)", // Light orange
      "rgb(153, 255, 153)", // Light green
      "rgb(255, 153, 204)", // Light pink
    ];

    return {
      labels: labels.length > 0 ? labels : ["No Data"],
      datasets: [
        {
          label: "Expenses by Category",
          data: data.length > 0 ? data : [1],
          backgroundColor: colors.slice(
            0,
            labels.length > 0 ? labels.length : 1
          ),
          hoverOffset: 4,
        },
      ],
    };
  };

  // Generate monthly trend data
  const getMonthlyData = () => {
    const monthlyTotals = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Initialize all months with 0
    months.forEach((month, index) => {
      monthlyTotals[index] = 0;
    });

    // Calculate totals by month for current year
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === currentYear) {
        const month = expenseDate.getMonth();
        monthlyTotals[month] += expense.amount;
      }
    });

    // Get last 6 months including current month
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    const last6MonthsData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIndex]);
      last6MonthsData.push(monthlyTotals[monthIndex]);
    }

    return {
      labels: last6Months,
      datasets: [
        {
          label: "Monthly Expenses",
          data: last6MonthsData,
          fill: false,
          backgroundColor: "rgb(102, 102, 255)",
          borderColor: "rgb(102, 102, 255)",
          tension: 0.1,
        },
      ],
    };
  };

  // Responsive chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: windowWidth < 768 ? "bottom" : "top",
        labels: {
          boxWidth: windowWidth < 768 ? 10 : 40,
          font: {
            size: windowWidth < 768 ? 10 : 12,
          },
        },
      },
    },
  };

  const statCards = [
    {
      title: "Total Expenses",
      value: `$${getTotalExpenses().toFixed(2)}`,
      description: "All time expenses",
      symbol: <DollarSign className="text-blue-500" />,
    },
    {
      title: "Monthly Expenses",
      value: `$${getCurrentMonthExpenses().toFixed(2)}`,
      description: "Current month",
      symbol: <Calendar className="text-purple-500" />,
    },
    {
      title: "Monthly Budget",
      value: `$${getTotalBudget().toFixed(2)}`,
      description: "Target Spending",
      symbol: <Wallet className="text-orange-400" />,
    },
    {
      title: "Remaining Budget",
      value: (
        <div className={isOverBudget ? "text-red-500" : "text-green-500"}>
          ${Math.abs(getRemainingBudget()).toFixed(2)}
        </div>
      ),
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
            className={`h-full ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full ml-5 flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

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
              <div className="font-semibold text-sm md:text-base">
                {card.title}
              </div>
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
          <div className="font-bold text-lg md:text-xl mb-1 md:mb-2">
            Monthly Trend
          </div>
          <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">
            Your expense trend over the last 6 months
          </div>
          <div className="h-60 md:h-72">
            <Line data={getMonthlyData()} options={chartOptions} />
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="border-2 p-4 md:p-6 rounded-lg shadow-sm">
          <div className="font-bold text-lg md:text-xl mb-1 md:mb-2">
            Expense Categories
          </div>
          <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">
            Breakdown of your current month's expenses
          </div>
          <div className="h-60 md:h-72">
            <Pie data={getCategoryData()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* No Data Messages */}
      {expenses.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">
            No expenses recorded yet. Start adding expenses to see your
            dashboard data!
          </p>
        </div>
      )}

      {budget.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
          <p className="text-yellow-700">
            No budgets set yet. Create budgets to track your spending limits!
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
