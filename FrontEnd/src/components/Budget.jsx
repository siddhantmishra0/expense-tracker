import { plugins, scales } from "chart.js";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";

function Budget() {
  // const [totalBudget, setTotalBudget] = useState(0);
  // const [foodBudget, setFoodBudget] = useState(0);
  // const [transportBudget, setTransportBudget] = useState(0);
  // const [billsBudget, setBillsBudget] = useState(0);
  // const [shoppingBudget, setShoppingBudget] = useState(0);
  // const [entertainementBudget, setEntertainmentBudget] = useState(0);
  // const [healthBudget, setHealthBudget] = useState(0);
  // const [educationBudget, setEducationBudget] = useState(0);
  // const [otherBudget, setOtherBudget] = useState(0);

  const [budgets, setBudgets] = useState({
    Food: 0,
    Transport: 0,
    Bills: 0,
    Shopping: 0,
    Entertainment: 0,
    Health: 0,
    Education: 0,
    Other: 0,
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/login", {
        withCredentials: true,
      })
      .then((response) => setUserId(response.data.user._id))
      .catch((error) => console.log("Fetch error: ", error));
  }, []);

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
          expenseByCategory.Food ,
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
    if (progress >= 100) {
      progress = 100;
    } else {
      progress = progress;
    }

    return (
      <div
        className={`flex items-center w-full h-2 border rounded-md overflow-hidden ${
          progress > 75 ? "bg-yellow-500" : "bg-green-500"
        }`}
      >
        <div
          className={`h-2 rounded-md bg-black`}
          style={{ width: progress + "%" }}
        ></div>
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
        Overall: 0, // add this to avoid undefined access
      };

      data.forEach((item) => {
        if (newBudgets.hasOwnProperty(item.category)) {
          newBudgets[item.category] = parseFloat(item.amount);
        } else if (item.category === "Overall") {
          newBudgets["Overall"] = parseFloat(item.amount);
        }
      });

      setBudgets(newBudgets);
    } catch (error) {
      console.log("Error while fetching budgets ", error);
    }
  };


  useEffect(() => {
    if (userId) fetchBudget();
    fetchExpenses()
  }, [userId]);

  // const selectBudget = (e) =>{
  //   if(budgetType === "Overall"){
  //     setTotalBudget(e)
  //   }
  //   else if(budgetType === "Food"){
  //     setFoodBudget(e)
  //   }
  //   else if(budgetType === "Transport"){
  //     setTransportBudget(e)
  //   }
  //   else if(budgetType === "Bills"){
  //     setBillsBudget(e)
  //   }
  //   else if(budgetType === "Shopping"){
  //     setShoppingBudget(e)
  //   }
  //   else if(budgetType === "Entertainment"){
  //     setEntertainmentBudget(e)
  //   }
  //   else if(budgetType === "Health"){
  //     setHealthBudget(e)
  //   }
  //   else if(budgetType === "Education"){
  //     setEducationBudget(e)
  //   }
  //   else if(budgetType === "Other"){
  //     setOtherBudget(e)
  //   }
  // }

  const handleAdd = (e) => {
    e.preventDefault();
    if (!budgetAmount || isNaN(budgetAmount)) return;
    // setBudgets((prev)=>({
    //   ...prev,
    //   [budgetType]: parseFloat(budgetAmount)
    // }))
    axios
      .post(
        "http://localhost:3000/home/budget",
        {
          userId,
          budgetAmount,
          budgetType,
        },
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        console.log(result);
        fetchBudget()
      });
    setBudgetAmount("");
  };

  const fetchExpenses = async () => {
     if (!userId) return;
     try {
       const res = await axios.get(
         `http://localhost:3000/home/expense?userId=${userId}`,
         { withCredentials: true }
       );
      //  console.log(res.data)
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
         Overall: 0, // add this to avoid undefined access
       };

       data.forEach((item) => {
         if (spentBudgets.hasOwnProperty(item.category)) {
           spentBudgets[item.category] += parseFloat(item.amount);
          // console.log(item.category)
         } else {
           spentBudgets.Other += parseFloat(item.amount);
         }
         spentBudgets.Overall += parseFloat(item.amount)
       });
       setExpenseByCategory(spentBudgets)
       console.log(spentBudgets);
       
     } catch (error) {
       console.log("Error while fetching expenses ", error);
     }
  };

  const arrowUpDown = (a,b) => {
    if((a/b)*100 <= 50){
      return "down"
    }
    else {
      return "up"
    }
  }

  return (
    <div className="w-full ml-5">
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
              className="border rounded-md p-2 w-full"
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
            >
              {Object.keys(budgets).map((category) => (
                <option key={category}>{category}</option>
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
              min={0}
              className="border rounded-md p-2 w-full"
              onChange={(e) => setBudgetAmount(e.target.value)}
            />
          </div>
          {/* <div className="flex flex-col mt-4 gap-2">
            <label htmlFor="period" className="font-semibold">
              Period
            </label>
            <select id="period" className="border rounded-md p-2 w-full">
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div> */}
          <div className="flex justify-end">
            <button
              className="border rounded-md bg-black text-white p-2 px-4 mt-4"
              onClick={handleAdd}
            >
              Add Budget
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
          Monthly spending limit
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 mb-4">
          <div className="flex flex-col mb-2 sm:mb-0">
            <div className="font-bold text-xl md:text-2xl">{`$${
              parseFloat(expenseByCategory.Overall)
            }`}</div>
            <div className="text-gray-500 text-sm md:text-base">{`spent of $${parseFloat(
              budgets.Overall
            )}`}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-xl md:text-2xl">{`$${
              budgets.Overall - expenseByCategory.Overall
            }`}</div>
            <div className="text-gray-500 text-sm md:text-base">remaining</div>
          </div>
        </div>
        <ProgressBar progress={(expenseByCategory.Overall/budgets.Overall)*100} />
        <div className="flex justify-end">
          <button className="border rounded-md p-2 mt-4 font-semibold text-sm md:text-base">
            Edit Budget
          </button>
        </div>
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
              progress: (expenseByCategory.Food/budgets.Food)*100,
              trending: arrowUpDown(expenseByCategory.Food,budgets.Food),
            },
            {
              name: "Transport",
              budget: budgets.Transport,
              spent: expenseByCategory.Transport,
              progress: (expenseByCategory.Transport/budgets.Transport)*100,
              trending: arrowUpDown(expenseByCategory.Transport,budgets.Transport),
            },
            {
              name: "Bills",
              budget: budgets.Bills,
              spent: expenseByCategory.Bills,
              progress: (expenseByCategory.Bills/budgets.Bills)*100,
              trending: arrowUpDown(expenseByCategory.Bills,budgets.Bills),
            },
            {
              name: "Shopping",
              budget: budgets.Shopping,
              spent: expenseByCategory.Shopping,
              progress: (expenseByCategory.Shopping/budgets.Shopping)*100,
              trending: arrowUpDown(expenseByCategory.Shopping,budgets.Shopping),
            },
          ].map((category, index) => (
            <div key={index} className="mb-4 pb-2 border-b last:border-b-0">
              <div className="flex flex-wrap justify-between mb-2">
                <div className="font-semibold">{category.name}</div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-sm md:text-base">{`$${category.spent}.00 of $${category.budget}.00`}</div>
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
                <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base">
                  Edit
                </button>
                <button className="font-semibold hover:bg-gray-100 p-1 px-2 md:p-2 md:px-4 rounded-md text-sm md:text-base">
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
