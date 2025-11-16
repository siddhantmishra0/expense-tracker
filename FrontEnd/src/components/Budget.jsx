import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Budget() {
  const [budgets, setBudgets] = useState({
    Food: 0,
    Transport: 0,
    Bills: 0,
    Shopping: 0,
    Entertainment: 0,
    Health: 0,
    Education: 0,
    Other: 0,
    Overall: 0,
  });

  const [budgetIds, setBudgetIds] = useState({});

  const [expenseByCategory, setExpenseByCategory] = useState({
    Food: 0,
    Transport: 0,
    Bills: 0,
    Shopping: 0,
    Entertainment: 0,
    Health: 0,
    Education: 0,
    Other: 0,
    Overall: 0,
  });

  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetType, setBudgetType] = useState("Other");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingData, setFetchingData] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  useEffect(() => {
    const categories = [
      "Food",
      "Transport",
      "Bills",
      "Shopping",
      "Entertainment",
      "Health",
      "Education",
      "Other",
    ];
    const total = categories.reduce((sum, cat) => sum + (budgets[cat] || 0), 0);

    if (budgets.Overall !== total) {
      setBudgets((prev) => ({
        ...prev,
        Overall: total,
      }));
    }
  }, [
    budgets.Food,
    budgets.Transport,
    budgets.Bills,
    budgets.Shopping,
    budgets.Entertainment,
    budgets.Health,
    budgets.Education,
    budgets.Other,
  ]);

  const safePercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    const percentage = (spent / budget) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const safeSubtraction = (a, b) => {
    const result = (parseFloat(a) || 0) - (parseFloat(b) || 0);
    return Math.max(result, 0);
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2);
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await axios.get("http://localhost:3000/login", {
          withCredentials: true,
        });
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Authentication error:", error);
        window.location.href = "/";
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      Promise.all([fetchBudget(), fetchExpenses()]).finally(() =>
        setFetchingData(false)
      );
    }
  }, [userId]);

  const budgetData = {
    labels: ["Food", "Transport", "Bills", "Shopping"],
    datasets: [
      {
        label: "Budget",
        data: [
          budgets.Food,
          budgets.Transport,
          budgets.Bills,
          budgets.Shopping,
        ],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Spent",
        data: [
          expenseByCategory.Food,
          expenseByCategory.Transport,
          expenseByCategory.Bills,
          expenseByCategory.Shopping,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  const budgetOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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

  const ProgressBar = ({ progress }) => {
    const validProgress = isNaN(progress)
      ? 0
      : Math.min(Math.max(progress, 0), 100);

    return (
      <div
        className={`flex items-center w-full h-2 border rounded-md overflow-hidden ${
          validProgress > 75
            ? "bg-red-100"
            : validProgress > 50
            ? "bg-yellow-100"
            : "bg-green-100"
        }`}
      >
        <div
          className={`h-2 rounded-md transition-all duration-300 ${
            validProgress > 75
              ? "bg-red-500"
              : validProgress > 50
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${validProgress}%` }}
        />
      </div>
    );
  };

  const fetchBudget = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/home/budget?userId=${userId}`,
        { withCredentials: true }
      );
      const data = res.data;

      const newBudgets = {
        Food: 0,
        Transport: 0,
        Bills: 0,
        Shopping: 0,
        Entertainment: 0,
        Health: 0,
        Education: 0,
        Other: 0,
        Overall: 0,
      };

      const newBudgetIds = {};

      data.forEach((item) => {
        if (
          newBudgets.hasOwnProperty(item.category) &&
          item.category !== "Overall"
        ) {
          newBudgets[item.category] = parseFloat(item.amount) || 0;
          newBudgetIds[item.category] = item._id;
        }
      });

      const categories = [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Other",
      ];
      newBudgets.Overall = categories.reduce(
        (sum, cat) => sum + newBudgets[cat],
        0
      );

      setBudgets(newBudgets);
      setBudgetIds(newBudgetIds);
    } catch (error) {
      console.error("Error while fetching budgets:", error);
      setError("Failed to fetch budgets. Please try again.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      setError("Please enter a valid budget amount greater than 0");
      return;
    }

    if (!budgetType) {
      setError("Please select a budget category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/home/budget",
        {
          userId,
          budgetAmount: parseFloat(budgetAmount),
          budgetType,
        },
        { withCredentials: true }
      );

      await fetchBudget();
      setBudgetAmount("");
    } catch (error) {
      console.error("Error adding budget:", error);
      if (error.response?.status === 400) {
        setError("Invalid input. Please check your data and try again.");
      } else if (error.response?.status === 404) {
        setError("User not found. Please log in again.");
      } else {
        setError("Failed to add budget. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3000/home/expense?userId=${userId}`,
        { withCredentials: true }
      );
      const data = res.data;

      const spentBudgets = {
        Food: 0,
        Transport: 0,
        Bills: 0,
        Shopping: 0,
        Entertainment: 0,
        Health: 0,
        Education: 0,
        Other: 0,
        Overall: 0,
      };

      data.forEach((item) => {
        const amount = parseFloat(item.amount) || 0;
        if (spentBudgets.hasOwnProperty(item.category)) {
          spentBudgets[item.category] += amount;
        } else {
          spentBudgets.Other += amount;
        }
        spentBudgets.Overall += amount;
      });

      setExpenseByCategory(spentBudgets);
    } catch (error) {
      console.error("Error while fetching expenses:", error);
      setError("Failed to fetch expenses data");
    }
  };

  const handleEditClick = (category) => {
    if (category === "Overall") {
      setError(
        "Overall budget is automatically calculated from all categories. Edit individual categories instead."
      );
      return;
    }
    setEditingCategory(category);
    setEditAmount(budgets[category].toString());
    setIsEditModalOpen(true);
    setError("");
  };

  // UPDATED: Validate edit amount against current expenses
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const newAmount = parseFloat(editAmount);
    const currentExpense = expenseByCategory[editingCategory] || 0;

    if (!editAmount || isNaN(newAmount) || newAmount <= 0) {
      setError("Please enter a valid budget amount greater than 0");
      return;
    }

    // NEW VALIDATION: Check if new budget is less than current expenses
    if (newAmount < currentExpense) {
      setError(
        `Budget amount cannot be less than current expenses ($${formatCurrency(
          currentExpense
        )}). Please enter an amount greater than or equal to $${formatCurrency(
          currentExpense
        )}.`
      );
      return;
    }

    const budgetId = budgetIds[editingCategory];
    if (!budgetId) {
      setError("Budget ID not found. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:3000/home/budget/${budgetId}`,
        {
          amount: newAmount,
          category: editingCategory,
        },
        { withCredentials: true }
      );

      await fetchBudget();
      setIsEditModalOpen(false);
      setEditingCategory(null);
      setEditAmount("");
    } catch (error) {
      console.error("Error updating budget:", error);
      setError("Failed to update budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    if (category === "Overall") {
      setError(
        "Cannot delete Overall budget. It's automatically calculated from all categories."
      );
      return;
    }
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
    setError("");
  };

  const handleDeleteConfirm = async () => {
    const budgetId = budgetIds[deletingCategory];

    if (!budgetId) {
      setError("Budget ID not found. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (expenseByCategory[deletingCategory] > 0) {
        await axios.delete("http://localhost:3000/home/expense", {
          data: {
            userId,
            category: deletingCategory,
          },
          withCredentials: true,
        });
      }

      await axios.delete(`http://localhost:3000/home/budget/${budgetId}`, {
        withCredentials: true,
      });

      await Promise.all([fetchBudget(), fetchExpenses()]);

      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      console.error("Error deleting budget:", error);
      console.error("Error details:", error.response?.data);
      setError(
        error.response?.data?.message ||
          "Failed to delete budget. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const arrowUpDown = (spent, budget) => {
    if (!budget || budget === 0) return "down";
    return (spent / budget) * 100 <= 50 ? "down" : "up";
  };

  if (fetchingData) {
    return (
      <div className="w-full ml-5 flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading budget data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ml-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* UPDATED EDIT MODAL with minimum value constraint */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Edit {editingCategory} Budget
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Display current expense information */}
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current Expenses:</span> $
                {formatCurrency(expenseByCategory[editingCategory] || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Budget must be equal to or greater than current expenses
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="editAmount" className="block font-semibold mb-2">
                New Budget Amount ($)
              </label>
              <input
                id="editAmount"
                type="number"
                value={editAmount}
                min={expenseByCategory[editingCategory] || 0}
                step="0.01"
                placeholder="Enter amount"
                className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEditAmount(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: $
                {formatCurrency(expenseByCategory[editingCategory] || 0)}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setError("");
                }}
                className="border rounded-md px-4 py-2 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? "Updating..." : "Update Budget"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete the budget for {deletingCategory}?
              This will also delete all expenses in this category. This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="border rounded-md px-4 py-2 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4 md:p-6">
          <div className="font-semibold text-xl md:text-2xl">Set Budget</div>
          <div className="text-gray-500 text-sm md:text-base">
            Define spending limits for different categories
          </div>
          <div className="flex flex-col mt-4 md:mt-6 gap-2">
            <label htmlFor="category" className="font-semibold">
              Category
            </label>
            <select
              id="category"
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              disabled={loading}
            >
              {Object.keys(budgets)
                .filter((category) => category !== "Overall")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col mt-4 gap-2">
            <label htmlFor="budget" className="font-semibold">
              Budget Amount ($)
            </label>
            <input
              id="budget"
              type="number"
              value={budgetAmount}
              min="0"
              step="0.01"
              placeholder="Enter amount"
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setBudgetAmount(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              className="border rounded-md bg-black text-white p-2 px-4 mt-4 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Adding..." : "Add Budget"}
            </button>
          </div>
        </div>

        <div className="border rounded-md p-4 md:p-6">
          <div className="font-semibold text-xl md:text-2xl">
            Budget vs. Spending
          </div>
          <div className="text-gray-500 text-sm md:text-base">
            Compare your budgets with actual spending
          </div>
          <div className="h-64 mt-4">
            <Bar data={budgetData} options={budgetOptions} />
          </div>
        </div>
      </div>

      <div className="border rounded-md mt-4 p-4 md:p-6">
        <div className="font-semibold text-xl md:text-2xl">Overall Budget</div>
        <div className="text-gray-500 text-sm md:text-base">
          Total of all category budgets (automatically calculated)
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 mb-4">
          <div className="flex flex-col mb-2 sm:mb-0">
            <div className="font-bold text-xl md:text-2xl">
              ${formatCurrency(expenseByCategory.Overall)}
            </div>
            <div className="text-gray-500 text-sm md:text-base">
              spent of ${formatCurrency(budgets.Overall)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-xl md:text-2xl">
              $
              {formatCurrency(
                safeSubtraction(budgets.Overall, expenseByCategory.Overall)
              )}
            </div>
            <div className="text-gray-500 text-sm md:text-base">remaining</div>
          </div>
        </div>
        <ProgressBar
          progress={safePercentage(expenseByCategory.Overall, budgets.Overall)}
        />
      </div>

      <div className="border rounded-md mt-4 p-4 md:p-6">
        <div className="font-semibold text-xl md:text-2xl">
          Category Budgets
        </div>
        <div className="text-gray-500 text-sm md:text-base">
          Track spending across different categories
        </div>
        <div className="mt-4">
          {[
            {
              name: "Food",
              budget: budgets.Food,
              spent: expenseByCategory.Food,
              progress: safePercentage(expenseByCategory.Food, budgets.Food),
              trending: arrowUpDown(expenseByCategory.Food, budgets.Food),
            },
            {
              name: "Transport",
              budget: budgets.Transport,
              spent: expenseByCategory.Transport,
              progress: safePercentage(
                expenseByCategory.Transport,
                budgets.Transport
              ),
              trending: arrowUpDown(
                expenseByCategory.Transport,
                budgets.Transport
              ),
            },
            {
              name: "Bills",
              budget: budgets.Bills,
              spent: expenseByCategory.Bills,
              progress: safePercentage(expenseByCategory.Bills, budgets.Bills),
              trending: arrowUpDown(expenseByCategory.Bills, budgets.Bills),
            },
            {
              name: "Shopping",
              budget: budgets.Shopping,
              spent: expenseByCategory.Shopping,
              progress: safePercentage(
                expenseByCategory.Shopping,
                budgets.Shopping
              ),
              trending: arrowUpDown(
                expenseByCategory.Shopping,
                budgets.Shopping
              ),
            },
            {
              name: "Entertainment",
              budget: budgets.Entertainment,
              spent: expenseByCategory.Entertainment,
              progress: safePercentage(
                expenseByCategory.Entertainment,
                budgets.Entertainment
              ),
              trending: arrowUpDown(
                expenseByCategory.Entertainment,
                budgets.Entertainment
              ),
            },
            {
              name: "Health",
              budget: budgets.Health,
              spent: expenseByCategory.Health,
              progress: safePercentage(
                expenseByCategory.Health,
                budgets.Health
              ),
              trending: arrowUpDown(expenseByCategory.Health, budgets.Health),
            },
            {
              name: "Education",
              budget: budgets.Education,
              spent: expenseByCategory.Education,
              progress: safePercentage(
                expenseByCategory.Education,
                budgets.Education
              ),
              trending: arrowUpDown(
                expenseByCategory.Education,
                budgets.Education
              ),
            },
            {
              name: "Other",
              budget: budgets.Other,
              spent: expenseByCategory.Other,
              progress: safePercentage(expenseByCategory.Other, budgets.Other),
              trending: arrowUpDown(expenseByCategory.Other, budgets.Other),
            },
          ].map((category, index) => (
            <div key={index} className="mb-4 pb-2 border-b last:border-b-0">
              <div className="flex flex-wrap justify-between mb-2">
                <div className="font-semibold">{category.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-sm md:text-base">
                    ${formatCurrency(category.spent)} of $
                    {formatCurrency(category.budget)}
                  </div>
                  <div
                    className={
                      category.trending === "up"
                        ? "text-red-500"
                        : "text-green-400"
                    }
                  >
                    {category.trending === "up" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                  </div>
                </div>
              </div>
              <ProgressBar progress={category.progress} />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleEditClick(category.name)}
                  className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(category.name)}
                  className="font-semibold hover:bg-red-50 hover:text-red-600 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Budget;
