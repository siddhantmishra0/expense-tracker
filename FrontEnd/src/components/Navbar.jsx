// import React, { useState } from "react";
// import Dashboard from "./Dashboard";
// import Expenses from "./Expenses";
// import Report from "./Report";
// import Budget from "./Budget";
// import Insights from "./Insights";
// import { useNavigate,Link, useLocation, Outlet } from "react-router-dom";
// import { useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Navbar() {
//   const location = useLocation();
//   const [user, setUser] = useState();
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/login", {
//         withCredentials: true,
//       })
//       .then((response) => setUser(response.data.user.username))
//       .catch((error) => {
//         console.log("Fetch error: ", error);
//         window.location.href = "/";
//         toast.success("Logged out successfully!");

//       });
//     }, []);

//   const handleClick = (e) => {
//     e.preventDefault();
//     axios.post("http://localhost:3000/logout",{}, {
//       withCredentials: true
//     })
//       .then((result) => {
//         console.log(result);
//         try {
//           if (result.data === "Logged out successfully") {
//             navigate("/");
//             toast.success("Logged out successfully");
//           }
//         } catch (error) {
//           console.log("logout error ", error);
//         }
//       })
//       .catch((error) => console.log("Logout fetch error ", error));
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="w-screen">
//         <div className="flex flex-col sm:flex-row justify-between items-center px-14 py-4 ml-4">
//           <div className="font-bold text-2xl mb-2 sm:mb-0">Expense Tracker</div>
//           <div className="flex flex-col sm:flex-row items-center gap-2">
//             <div>Welcome, {user}</div>
//             <button
//               onClick={handleClick}
//               className="border rounded-md px-4 py-2 text-sm"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row px-4 md:px-16 py-4 gap-4">
//         {/* Left Sidebar (turns horizontal on small screens) */}
//         <div className="bg-white rounded-md p-4 shadow-sm border w-full h-full lg:w-60">
//           {[
//             { label: "Dashboard", path: "/home" },
//             { label: "Expenses", path: "/home/expense" },
//             { label: "Reports", path: "/home/report" },
//             { label: "Budget", path: "/home/budget" },
//             { label: "AI Insights", path: "/home/insight" },
//           ].map((item, idx) => (
//             <Link key={idx} to={item.path}>
//               <div
//               className={`w-full text-left px-4 py-2 rounded-md font-medium ${
//                 location.pathname === item.path
//                   ? "bg-black text-white"
//                   : "text-black hover:bg-gray-100"
//               }`}
//               // onClick={() => setRightSide(item.value)}
//             >
//               {item.label}
//             </div>
//             </Link>
//           ))}
//         </div>
//         <div className="flex-1 w-full">
//           {/* {rightSide === "dashboard" && <Dashboard />}
//           {rightSide === "expense" && <Expenses />}
//           {rightSide === "report" && <Report />}
//           {rightSide === "budget" && <Budget />}
//           {rightSide === "insight" && <Insights />} */}
//           <Outlet/>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Get API URL from environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/login`, {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        });

        if (response.data.user && response.data.user.username) {
          setUser(response.data.user.username);
          setError("");
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.log("Auth error: ", error);
        setError("Authentication failed");

        if (error.code === "ECONNABORTED") {
          toast.error(
            "Connection timeout. Please check your internet connection."
          );
        } else if (error.response?.status === 401) {
          // User not authenticated
          navigate("/");
          toast.error("Please log in to continue");
        } else if (error.response?.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Failed to authenticate. Redirecting to login...");
          setTimeout(() => navigate("/"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    setLogoutLoading(true);
    setError("");

    try {
      const result = await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(result);

      if (result.data === "Logged out successfully" || result.status === 200) {
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log("Logout error: ", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Logout request timed out. Please try again.");
      } else if (error.response) {
        const errorMessage = error.response.data?.message || "Logout failed";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const retryAuth = () => {
    window.location.reload();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={retryAuth}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { label: "Dashboard", path: "/home" },
    { label: "Expenses", path: "/home/expense" },
    { label: "Reports", path: "/home/report" },
    { label: "Budget", path: "/home/budget" },
    { label: "AI Insights", path: "/home/insight" },
  ];

  return (
    <>
      {/* Header */}
      <div className="w-screen border-b bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-14 py-4">
          <div className="font-bold text-2xl mb-2 sm:mb-0">Expense Tracker</div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="text-sm sm:text-base">
              Welcome, <span className="font-medium">{user || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className={`border rounded-md px-4 py-2 text-sm transition-colors ${
                logoutLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:border-gray-400"
              }`}
            >
              {logoutLoading ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging out...
                </div>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row px-4 md:px-16 py-4 gap-4 min-h-screen bg-gray-50">
        {/* Left Sidebar (turns horizontal on small screens) */}
        <div className="bg-white rounded-md p-4 shadow-sm border w-full h-fit lg:w-60">
          <nav className="space-y-1">
            {navigationItems.map((item, idx) => (
              <Link key={idx} to={item.path}>
                <div
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full bg-white rounded-md shadow-sm border">
          <div className="p-4 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}