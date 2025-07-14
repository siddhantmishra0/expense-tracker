import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Food");
  const [tags, setTags] = useState("");
  const [userId, setUserId] = useState("");

  // useEffect(() => {
  //   // axios.get("http://localhost:3000/home/expense",{withCredentials: true})
  //   // .then((res)=> {
  //   //   setExpenses(res.data)
  //   // })
  //   // .catch((error)=> console.log("Error while fetching expenses ",error))
  //   fetchExpenses();
  // }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/login", {
        withCredentials: true,
      })
      .then((response) => setUserId(response.data.user._id))
      .catch((error) => console.log("Fetch error: ", error));
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

  useEffect(() => {
    if (userId) fetchExpenses();
  }, [userId]);

  // const fetchExpenses = async () => {
  //   axios.get("http://localhost:3000/home/expense", {
  //       withCredentials: true,
  //     })
  //     .then((res) => setExpenses(res.data))
  //     .catch((error) => console.log("Error while fetching expenses ", error));
  // };

  // useEffect(() => {
  //   const savedExpenses = localStorage.getItem('expenses');
  //   if (savedExpenses) {
  //     setExpenses(JSON.parse(savedExpenses));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('expenses', JSON.stringify(expenses));
  // }, [expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const newExpense = {
    //   id: uuidv4(),
    //   description,
    //   amount: parseFloat(amount),
    //   date,
    //   category,
    //   tags: tags.split(",").map((tag) => tag.trim()),
    // };
    // const newExpense = {
    //   id: uuidv4(),
    //   description,
    //   amount: parseFloat(amount),
    //   date,
    //   category,
    //   tags: tags.split(",").map(tag => tag.trim())
    // };
    try {
      axios
        .post(
          "http://localhost:3000/home/expense",
          {
            //   id: uuidv4(),
            // description,
            // amount: parseFloat(amount),
            // date,
            // category,
            // tags: tags.split(",").map(tag => tag.trim())
            // },
            // id: uuidv4(),
            description,
            amount: parseFloat(amount),
            date,
            category,
            tags: tags.split(",").map((tag) => tag.trim()),
            userId,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // console.log(newExpense);
          // console.log(result)
          setDescription("");
          setAmount("");
          setDate("");
          setCategory("Food");
          setTags("");
          fetchExpenses();
          // setExpenses((prevExpense) => [...prevExpense, newExpense]);

          // console.log(expenses);
        })
        .catch((error) => {
          console.log("Error while posting expense ", error);
        });
      // if(response.data.expense){
      //   setExpenses(prevExpense => [...prevExpense,response.data.expense])
      // }else {
      // console.log(newExpense)

      // }
      // console.log("Expense added successfully ",response.data);
    } catch (error) {
      console.error("Error adding expense:", error);
    }

    // try {
    // axios.post("http://localhost:3000/home/expense",{...newExpense})
    // .then((result)=>{
    //   console.log("Expenses added ",result)
    //   setExpenses([...expenses, newExpense]);
    // })
    // .catch((error)=>{
    //   console.log("Error setting expense ",error)
    // })
    // } catch (error) {
    // console.error("Error while adding expense ",error)
    // }
    // Reset form
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense? "
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/home/expense/${id}`, {
        withCredentials: true,
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.log("Error in deleting expense ", error);
    }
  };
  return (
    <div className=" w-full ml-5">
      <div className="border w-full p-4 rounded-md mb-6">
        <h2 className="font-semibold text-xl md:text-2xl mb-4">
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit}>
          {/* First row of inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="description" className="block mb-1 font-medium">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="border rounded-md p-2 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block mb-1 font-medium">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                className="border rounded-md p-2 w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Second row of inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="date" className="block mb-1 font-medium">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="border rounded-md p-2 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-1 font-medium">
                Category
              </label>
              <select
                id="category"
                className="border rounded-md p-2 w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          {/* Tags input */}
          <div className="mb-4">
            <label htmlFor="tags" className="block mb-1 font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              placeholder="e.g. groceries, monthly, essential"
              className="border rounded-md p-2 w-full"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expenses List */}
      <div className="border-2 rounded-md p-4 shadow-md">
        <h2 className="font-semibold text-xl md:text-2xl mb-4">
          Your Expenses
        </h2>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No expenses added yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100 ">
                <tr>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left hidden sm:table-cell">Date</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Category
                  </th>
                  <th className="p-2 text-left hidden lg:table-cell">Tags</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b">
                    <td className="p-2">{expense.description}</td>
                    <td className="p-2">${expense.amount}</td>
                    <td className="p-2 hidden sm:table-cell">{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                    <td className="p-2 hidden md:table-cell">
                      {expense.category}
                    </td>
                    <td className="p-2 hidden lg:table-cell">
                      {expense.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 px-2 py-1 rounded-full text-sm mr-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td className="p-2 text-right">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(expense._id)}
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
