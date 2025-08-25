// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const Login = () => {
//   // const [isRegistering, setIsRegistering] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios
//       .post(
//         "http://localhost:3000/login",
//         { username, password },
//         {
//           withCredentials: true,
//         }
//       )
//       .then((result) => {
//         console.log(result);
//         if (result.data.status === "success") {
//           navigate("/home");
//           toast.success("Login Successfull, Welcome!");
//         }
//       })

//       .catch((err) => {
//         // console.log("Axios handle error ", err);
//         toast.error(err.response.data.error);
//         // toast.error("Invalid credentials")
//       });
//   };

//   return (
//     <div className="flex items-center justify-center w-screen px-4 mt-4">
//       <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2">
//         {/* Heading */}
//         <h2 className="text-2xl sm:text-2xl font-semibold text-center mb-1">
//           Expense Tracker
//         </h2>
//         <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
//           Sign in to manage your expenses
//         </p>

//         {/* Tabs */}
//         <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden border-2">
//           <button
//             // onClick={() => setIsRegistering(false)}
//             className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black`}
//           >
//             Login
//           </button>
//           <button
//             // onClick={() => setIsRegistering(true) }
//             onClick={() => navigate("/register")}
//             className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-gray-150 shadow text-gray-500`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Register Form */}

//         <form
//           className="space-y-4 border rounded-lg p-4 sm:p-6"
//           onSubmit={handleSubmit}
//         >
//           <div>
//             <label className="block mb-1 font-medium text-sm">Username</label>
//             <input
//               type="text"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium text-sm">Password</label>
//             <input
//               type="password"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Get API URL from environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/login`, {
          withCredentials: true,
        });
        if (response.data.user) {
          navigate("/home");
        }
      } catch (error) {
        // User not authenticated, stay on login page
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [navigate]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${API_BASE_URL}/login`,
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(result);

      if (result.data.status === "success") {
        toast.success("Login successful, Welcome!");
        navigate("/home");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "ECONNABORTED") {
        toast.error("Request timeout. Please check your internet connection.");
      } else if (err.response) {
        // Server responded with error
        const errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          "Login failed";
        toast.error(errorMessage);

        // Handle specific error cases
        if (err.response.status === 401) {
          setErrors({ general: "Invalid username or password" });
        } else if (err.response.status >= 500) {
          toast.error("Server error. Please try again later.");
        }
      } else if (err.request) {
        // Network error
        toast.error("Network error. Please check your internet connection.");
      } else {
        // Other error
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (field === "username") {
      setUsername(value);
    } else if (field === "password") {
      setPassword(value);
    }
  };

  const navigateToRegister = () => {
    if (!loading) {
      navigate("/register");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen px-4 mt-4 min-h-screen">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2 shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl sm:text-2xl font-semibold text-center mb-1">
          Expense Tracker
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          Sign in to manage your expenses
        </p>

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden border-2">
          <button
            className="w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black"
            disabled
          >
            Login
          </button>
          <button
            onClick={navigateToRegister}
            disabled={loading}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-150 shadow text-gray-500 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form
          className="space-y-4 border rounded-lg p-4 sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-medium text-sm"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              } ${loading ? "bg-gray-50" : ""}`}
              onChange={(e) => handleInputChange("username", e.target.value)}
              disabled={loading}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              } ${loading ? "bg-gray-50" : ""}`}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className={`w-full py-2 rounded-md transition text-sm sm:text-base font-medium ${
              loading || !username.trim() || !password.trim()
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            Don't have an account?{" "}
            <button
              onClick={navigateToRegister}
              disabled={loading}
              className={`text-black font-medium ${
                loading ? "cursor-not-allowed opacity-50" : "hover:underline"
              }`}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;