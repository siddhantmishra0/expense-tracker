import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Expenses from "./Expenses";
import Report from "./Report";
import Budget from "./Budget";
import Insights from "./Insights";
import { useNavigate,Link, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/login", {
        withCredentials: true,
      })
      .then((response) => setUser(response.data.user.username))
      .catch((error) => {
        console.log("Fetch error: ", error);
        window.location.href = "/";
        toast.success("Logged out successfully!");

      });
    }, []);

  const handleClick = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/logout",{}, {
      withCredentials: true
    })
      .then((result) => {
        console.log(result);
        try {
          if (result.data === "Logged out successfully") {
            navigate("/");
            toast.success("Logged out successfully");
          }
        } catch (error) {
          console.log("logout error ", error);
        }
      })
      .catch((error) => console.log("Logout fetch error ", error));
  };

  return (
    <>
      {/* Header */}
      <div className="w-screen">
        <div className="flex flex-col sm:flex-row justify-between items-center px-14 py-4 ml-4">
          <div className="font-bold text-2xl mb-2 sm:mb-0">Expense Tracker</div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div>Welcome, {user}</div>
            <button
              onClick={handleClick}
              className="border rounded-md px-4 py-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-4 md:px-16 py-4 gap-4">
        {/* Left Sidebar (turns horizontal on small screens) */}
        <div className="bg-white rounded-md p-4 shadow-sm border w-full h-full lg:w-60">
          {[
            { label: "Dashboard", path: "/home" },
            { label: "Expenses", path: "/home/expense" },
            { label: "Reports", path: "/home/report" },
            { label: "Budget", path: "/home/budget" },
            { label: "Insights", path: "/home/insight" },
          ].map((item, idx) => (
            <Link key={idx} to={item.path}>
              <div
              className={`w-full text-left px-4 py-2 rounded-md font-medium ${
                location.pathname === item.path
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
              }`}
              // onClick={() => setRightSide(item.value)}
            >
              {item.label}
            </div>
            </Link>
          ))}
        </div>
        <div className="flex-1 w-full">
          {/* {rightSide === "dashboard" && <Dashboard />}
          {rightSide === "expense" && <Expenses />}
          {rightSide === "report" && <Report />}
          {rightSide === "budget" && <Budget />}
          {rightSide === "insight" && <Insights />} */}
          <Outlet/>
        </div>
      </div>
    </>
  );
}
