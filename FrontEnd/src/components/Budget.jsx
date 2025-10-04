// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import { TrendingUp, TrendingDown } from "lucide-react";
// import axios from "axios";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function Budget() {
//   const [budgets, setBudgets] = useState({
//     Food: 0,
//     Transport: 0,
//     Bills: 0,
//     Shopping: 0,
//     Entertainment: 0,
//     Health: 0,
//     Education: 0,
//     Other: 0,
//     Overall: 0,
//   });
//   const [expenseByCategory, setExpenseByCategory] = useState({
//     Food: 0,
//     Transport: 0,
//     Bills: 0,
//     Shopping: 0,
//     Entertainment: 0,
//     Health: 0,
//     Education: 0,
//     Other: 0,
//     Overall: 0,
//   });
//   const [budgetAmount, setBudgetAmount] = useState("");
//   const [budgetType, setBudgetType] = useState("Other");
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/login", {
//         withCredentials: true,
//       })
//       .then((response) => setUserId(response.data.user._id))
//       .catch((error) => {
//         console.log("Fetch error: ", error);
//         window.location.href = "/";
//       });
//   }, []);
//   const safePercentage = (spent, budget) => {
//     if (!budget || budget === 0) return 0;
//     return Math.min((spent / budget) * 100, 100);
//   };

//   // Safe subtraction helper
//   const safeSubtraction = (a, b) => {
//     return Math.max((a || 0) - (b || 0), 0);
//   };
//   const budgetData = {
//     labels: ["Food", "Transport", "Bills", "Shopping"],
//     datasets: [
//       {
//         label: "Budget",
//         data: [
//           budgets.Food,
//           budgets.Transport,
//           budgets.Bills,
//           budgets.Shopping,
//         ],
//         backgroundColor: "rgba(53, 162, 235, 0.5)",
//         borderColor: "rgb(53, 162, 235)",
//         borderWidth: 1,
//       },
//       {
//         label: "Spent",
//         data: [
//           expenseByCategory.Food,
//           expenseByCategory.Transport,
//           expenseByCategory.Bills,
//           expenseByCategory.Shopping,
//         ],
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//         borderColor: "rgb(255, 99, 132)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const budgetOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Amount ($)",
//         },
//       },
//     },
//   };

//   const ProgressBar = ({ progress }) => {
//     // Ensure progress is a valid number
//     const validProgress = isNaN(progress)
//       ? 0
//       : Math.min(Math.max(progress, 0), 100);

//     return (
//       <div
//         className={`flex items-center w-full h-2 border rounded-md overflow-hidden ${
//           validProgress > 75 ? "bg-yellow-500" : "bg-green-500"
//         }`}
//       >
//         <div
//           className="h-2 rounded-md bg-black"
//           style={{ width: `${validProgress}%` }}
//         />
//       </div>
//     );
//   };

//   const fetchBudget = async () => {
//     if (!userId) return;

//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.get(
//         `http://localhost:3000/home/budget?userId=${userId}`,
//         { withCredentials: true }
//       );
//       const data = res.data;

//       const newBudgets = { ...budgets }; // Keep existing structure

//       data.forEach((item) => {
//         if (newBudgets.hasOwnProperty(item.category)) {
//           newBudgets[item.category] = parseFloat(item.amount) || 0;
//         }
//       });

//       setBudgets(newBudgets);
//     } catch (error) {
//       console.error("Error while fetching budgets:", error);
//       setError("Failed to fetch budgets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchExpenses = async () => {
//     if (!userId) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:3000/home/expense?userId=${userId}`,
//         { withCredentials: true }
//       );
//       const data = res.data;

//       const spentBudgets = {
//         Food: 0,
//         Transport: 0,
//         Bills: 0,
//         Shopping: 0,
//         Entertainment: 0,
//         Health: 0,
//         Education: 0,
//         Other: 0,
//         Overall: 0,
//       };

//       data.forEach((item) => {
//         const amount = parseFloat(item.amount) || 0;
//         if (spentBudgets.hasOwnProperty(item.category)) {
//           spentBudgets[item.category] += amount;
//         } else {
//           spentBudgets.Other += amount;
//         }
//         spentBudgets.Overall += amount;
//       });

//       setExpenseByCategory(spentBudgets);
//     } catch (error) {
//       console.error("Error while fetching expenses:", error);
//     }
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();

//     if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
//       setError("Please enter a valid budget amount");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const result = await axios.post(
//         "http://localhost:3000/home/budget",
//         { userId, budgetAmount, budgetType },
//         { withCredentials: true }
//       );

//       console.log(result);
//       await fetchBudget(); // Refresh data
//       setBudgetAmount("");
//     } catch (error) {
//       console.error("Error adding budget:", error);
//       setError("Failed to add budget");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchBudget();
//     fetchExpenses();
//   }, [userId]);

//   // const handleAdd = (e) => {
//   //   e.preventDefault();
//   //   if (!budgetAmount || isNaN(budgetAmount)) return;
//   //   // setBudgets((prev)=>({
//   //   //   ...prev,
//   //   //   [budgetType]: parseFloat(budgetAmount)
//   //   // }))
//   //   axios
//   //     .post(
//   //       "http://localhost:3000/home/budget",
//   //       {
//   //         userId,
//   //         budgetAmount,
//   //         budgetType,
//   //       },
//   //       {
//   //         withCredentials: true,
//   //       }
//   //     )
//   //     .then((result) => {
//   //       console.log(result);
//   //       fetchBudget()
//   //     });
//   //   setBudgetAmount("");
//   // };

//   const arrowUpDown = (spent, budget) => {
//     if (!budget || budget === 0) return "down";
//     return (spent / budget) * 100 <= 50 ? "down" : "up";
//   };

//   return (
//     <div className="w-full ml-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border rounded-md p-4 md:p-6">
//           <div className="font-semibold text-xl md:text-2xl">Set Budget</div>
//           <div className="text-gray-500 text-sm md:text-base">
//             Define spending limits for different categories
//           </div>
//           <div className="flex flex-col mt-4 md:mt-6 gap-2">
//             <label htmlFor="category" className="font-semibold">
//               Category
//             </label>
//             <select
//               id="category"
//               className="border rounded-md p-2 w-full"
//               value={budgetType}
//               onChange={(e) => setBudgetType(e.target.value)}
//             >
//               {Object.keys(budgets).map((category) => (
//                 <option key={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex flex-col mt-4 gap-2">
//             <label htmlFor="budget" className="font-semibold">
//               Budget Amount ($)
//             </label>
//             <input
//               id="budget"
//               type="number"
//               value={budgetAmount}
//               min={0}
//               className="border rounded-md p-2 w-full"
//               onChange={(e) => setBudgetAmount(e.target.value)}
//             />
//           </div>
//           {/* <div className="flex flex-col mt-4 gap-2">
//             <label htmlFor="period" className="font-semibold">
//               Period
//             </label>
//             <select id="period" className="border rounded-md p-2 w-full">
//               <option value="Weekly">Weekly</option>
//               <option value="Monthly">Monthly</option>
//               <option value="Yearly">Yearly</option>
//             </select>
//           </div> */}
//           <div className="flex justify-end">
//             <button
//               className="border rounded-md bg-black text-white p-2 px-4 mt-4"
//               onClick={handleAdd}
//             >
//               Add Budget
//             </button>
//           </div>
//         </div>
//         <div className="border rounded-md p-4 md:p-6">
//           <div className="font-semibold text-xl md:text-2xl">
//             Budget vs. Spending
//           </div>
//           <div className="text-gray-500 text-sm md:text-base">
//             Compare your budgets with actual spending
//           </div>
//           <div className="h-64 mt-4">
//             <Bar data={budgetData} options={budgetOptions} />
//           </div>
//         </div>
//       </div>
//       <div className="border rounded-md mt-4 p-4 md:p-6">
//         <div className="font-semibold text-xl md:text-2xl">Overall Budget</div>
//         <div className="text-gray-500 text-sm md:text-base">
//           Monthly spending limit
//         </div>
//         <div className="flex flex-col sm:flex-row sm:justify-between mt-4 mb-4">
//           <div className="flex flex-col mb-2 sm:mb-0">
//             <div className="font-bold text-xl md:text-2xl">{`$${parseFloat(
//               expenseByCategory.Overall
//             )}`}</div>
//             <div className="text-gray-500 text-sm md:text-base">{`spent of $${parseFloat(
//               budgets.Overall
//             )}`}</div>
//           </div>
//           <div className="flex flex-col">
//             <div className="font-bold text-xl md:text-2xl">{`$${
//               budgets.Overall - expenseByCategory.Overall
//             }`}</div>
//             <div className="text-gray-500 text-sm md:text-base">remaining</div>
//           </div>
//         </div>
//         <ProgressBar
//           progress={(expenseByCategory.Overall / budgets.Overall) * 100}
//         />
//         <div className="flex justify-end">
//           <button className="border rounded-md p-2 mt-4 font-semibold text-sm md:text-base">
//             Edit Budget
//           </button>
//         </div>
//       </div>
//       <div className="border rounded-md mt-4 p-4 md:p-6">
//         <div className="font-semibold text-xl md:text-2xl">
//           Category Budgets
//         </div>
//         <div className="text-gray-500 text-sm md:text-base">
//           Track spending across different categories
//         </div>
//         <div className="mt-4">
//           {[
//             {
//               name: "Food",
//               budget: budgets.Food,
//               spent: expenseByCategory.Food,
//               progress: (expenseByCategory.Food / budgets.Food) * 100,
//               trending: arrowUpDown(expenseByCategory.Food, budgets.Food),
//             },
//             {
//               name: "Transport",
//               budget: budgets.Transport,
//               spent: expenseByCategory.Transport,
//               progress: (expenseByCategory.Transport / budgets.Transport) * 100,
//               trending: arrowUpDown(
//                 expenseByCategory.Transport,
//                 budgets.Transport
//               ),
//             },
//             {
//               name: "Bills",
//               budget: budgets.Bills,
//               spent: expenseByCategory.Bills,
//               progress: (expenseByCategory.Bills / budgets.Bills) * 100,
//               trending: arrowUpDown(expenseByCategory.Bills, budgets.Bills),
//             },
//             {
//               name: "Shopping",
//               budget: budgets.Shopping,
//               spent: expenseByCategory.Shopping,
//               progress: (expenseByCategory.Shopping / budgets.Shopping) * 100,
//               trending: arrowUpDown(
//                 expenseByCategory.Shopping,
//                 budgets.Shopping
//               ),
//             },
//           ].map((category, index) => (
//             <div key={index} className="mb-4 pb-2 border-b last:border-b-0">
//               <div className="flex flex-wrap justify-between mb-2">
//                 <div className="font-semibold">{category.name}</div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-gray-500 text-sm md:text-base">{`$${category.spent}.00 of $${category.budget}.00`}</div>
//                   <div
//                     className={
//                       category.trending === "up"
//                         ? "text-red-500"
//                         : "text-green-400"
//                     }
//                   >
//                     {category.trending === "up" ? (
//                       <TrendingUp size={16} />
//                     ) : (
//                       <TrendingDown size={16} />
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <ProgressBar progress={category.progress} />
//               <div className="flex justify-end mt-2">
//                 <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base">
//                   Edit
//                 </button>
//                 <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Budget;


import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { TrendingUp, TrendingDown, AlertCircle, Loader2 } from "lucide-react";
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

// Register Chart.js components
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

  // Safe division helper function
  const safePercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    const percentage = (spent / budget) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  // Safe subtraction helper
  const safeSubtraction = (a, b) => {
    const result = (parseFloat(a) || 0) - (parseFloat(b) || 0);
    return Math.max(result, 0);
  };

  // Format currency safely
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2);
  };

  // Get user ID on component mount
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

  // Fetch data when userId is available
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
    // Ensure progress is a valid number
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

      data.forEach((item) => {
        if (newBudgets.hasOwnProperty(item.category)) {
          newBudgets[item.category] = parseFloat(item.amount) || 0;
        }
      });

      setBudgets(newBudgets);
    } catch (error) {
      console.error("Error while fetching budgets:", error);
      setError("Failed to fetch budgets. Please try again.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // Validation
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
      const result = await axios.post(
        "http://localhost:3000/home/budget",
        {
          userId,
          budgetAmount: parseFloat(budgetAmount),
          budgetType,
        },
        { withCredentials: true }
      );

      console.log("Budget added successfully:", result.data);

      // Refresh budget data
      await fetchBudget();
      setBudgetAmount("");

      // Show success message briefly
      setError("");
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
      console.log("Expenses fetched:", spentBudgets);
    } catch (error) {
      console.error("Error while fetching expenses:", error);
      setError("Failed to fetch expenses data");
    }
  };

  const arrowUpDown = (spent, budget) => {
    if (!budget || budget === 0) return "down";
    return (spent / budget) * 100 <= 50 ? "down" : "up";
  };


  
  // Show loading state while fetching initial data
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
      {/* Error Alert */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Set Budget Section */}
        <div className="border rounded-md p-4 md:p-6">
          <div className="font-semibold text-xl md:text-2xl">Set Budget</div>
          <div className="text-gray-500 text-sm md:text-base">
            Define spending limits for different categories
          </div>
          <form onSubmit={handleAdd}>
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
                type="submit"
                className="border rounded-md bg-black text-white p-2 px-4 mt-4 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                {loading ? "Adding..." : "Add Budget"}
              </button>
            </div>
          </form>
        </div>

        {/* Budget vs Spending Chart */}
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

      {/* Overall Budget Section */}
      <div className="border rounded-md mt-4 p-4 md:p-6">
        <div className="font-semibold text-xl md:text-2xl">Overall Budget</div>
        <div className="text-gray-500 text-sm md:text-base">
          Monthly spending limit
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
        <div className="flex justify-end">
          <button className="border rounded-md p-2 mt-4 font-semibold text-sm md:text-base hover:bg-gray-100">
            Edit Budget
          </button>
        </div>
      </div>

      {/* Category Budgets Section */}
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
                <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base transition-colors">
                  Edit
                </button>
                <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base transition-colors">
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