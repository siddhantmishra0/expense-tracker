// import React, { useState } from "react";
// import axios from "axios"
// import { useNavigate,Link } from "react-router-dom";
// import toast from "react-hot-toast";

// const Register = () => {
//   // const [isRegistering, setIsRegistering] = useState(true);
//   const [username,setUserName] = useState("")
//   const [email,setEmail] = useState("")
//   const [password,setPassword] = useState("")
//   const [confirmPassword,setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) =>{
//     e.preventDefault();
//     if (password!=confirmPassword) {
//       toast.error("password and confirm password different");
//       return;
//     } 
//     axios.post("http://localhost:3000/register",{username,email,password})
//     .then(result => {console.log(result)
//         toast.success("Registered successfully. Please login!")
//         navigate("/login")
//     })
//     .catch((error)=> {
//       console.log("submit error ",error)
//       toast.error("Registration failed. Please try again")
//     })
    
//   }

//   return (
//     <div className="flex items-center justify-center w-screen px-4 mt-4">
//       <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2">
//         {/* Heading */}
//         <h2 className="text-2xl sm:text-2xl font-semibold text-center mb-1">Expense Tracker</h2>
//         <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
//           Sign in to manage your expenses
//         </p>

//         {/* Tabs */}
//         <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden border-2">
//           <button
//             onClick={()=> navigate("/login")}
//             // onClick={() => setIsRegistering(false)}
//             className={`w-1/2 py-2 font-medium text-sm sm:text-base transition 
//              bg-gray-150 shadow text-gray-500 
//             `}
//           >
//             Login
//           </button>
//           <button
//             // onClick={() => setIsRegistering(true)}
//             className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black`}
//           >
//             Register
//           </button>
//         </div>

//         {/* Register Form */}
       
//           <form className="space-y-4 border rounded-lg p-4 sm:p-6" onSubmit={handleSubmit}>
//             <div>
//               <label className="block mb-1 font-medium text-sm">Username</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
//                 onChange={(e)=> setUserName((e.target.value))}
//               />
//             </div>
            
//             <div>
//               <label className="block mb-1 font-medium text-sm">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
//                 onChange={(e)=>setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium text-sm">Password</label>
//               <input
//                 type="password"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
//                 onChange={(e)=>setPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium text-sm">Confirm Password</label>
//               <input
//                 type="password"
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm ${confirmPassword!=password ? "border-red-500" : ""}`}
//                 onChange={(e)=>setConfirmPassword(e.target.value)}
//               />
//             </div>
            
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
//             >
//               Register
//             </button>
//           </form>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

// Get API URL from environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        // User not authenticated, stay on register page
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [navigate]);

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePasswordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        (hasNumbers || hasSpecialChar),
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (username.trim().length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, and numbers or special characters";
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        `${API_BASE_URL}/register`,
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        },
        {
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(result);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.log("Registration error:", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please check your internet connection.");
      } else if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Registration failed";

        // Handle specific error cases
        if (error.response.status === 409) {
          // Conflict - user already exists
          if (errorMessage.toLowerCase().includes("username")) {
            setErrors({ username: "Username already exists" });
          } else if (errorMessage.toLowerCase().includes("email")) {
            setErrors({ email: "Email already registered" });
          } else {
            toast.error("User already exists with this username or email");
          }
        } else if (error.response.status === 400) {
          // Bad request - validation error
          toast.error(errorMessage);
        } else if (error.response.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your internet connection.");
      } else {
        // Other error
        toast.error("Registration failed. Please try again.");
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

    switch (field) {
      case "username":
        setUserName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        // Clear confirm password error if passwords now match
        if (errors.confirmPassword && value === confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
  };

  const navigateToLogin = () => {
    if (!loading) {
      navigate("/login");
    }
  };

  const getPasswordStrengthColor = () => {
    if (!password) return "gray";
    const validation = validatePasswordStrength(password);
    const score = Object.values(validation.checks).filter(Boolean).length;

    if (score < 2) return "red";
    if (score < 4) return "yellow";
    return "green";
  };

  const isFormValid =
    username.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  return (
    <div className="flex items-center justify-center w-screen px-4 mt-4 min-h-screen">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2 shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl sm:text-2xl font-semibold text-center mb-1">
          Expense Tracker
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          Create your account to start tracking expenses
        </p>

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden border-2">
          <button
            onClick={navigateToLogin}
            disabled={loading}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-150 shadow text-gray-500 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            className="w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black"
            disabled
          >
            Register
          </button>
        </div>

        {/* Register Form */}
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
            <label htmlFor="email" className="block mb-1 font-medium text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              } ${loading ? "bg-gray-50" : ""}`}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={loading}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
              autoComplete="new-password"
              required
            />
            {password && (
              <div className="mt-1">
                <div
                  className={`h-1 rounded-full bg-${getPasswordStrengthColor()}-500`}
                ></div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be 8+ characters with uppercase, lowercase, and
                  numbers/symbols
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 font-medium text-sm"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                errors.confirmPassword ||
                (confirmPassword && password !== confirmPassword)
                  ? "border-red-500 focus:ring-red-500"
                  : password && confirmPassword && password === confirmPassword
                  ? "border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:ring-black"
              } ${loading ? "bg-gray-50" : ""}`}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              disabled={loading}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-green-500 text-xs mt-1">Passwords match</p>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-2 rounded-md transition text-sm sm:text-base font-medium ${
              loading || !isFormValid
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            Already have an account?{" "}
            <button
              onClick={navigateToLogin}
              disabled={loading}
              className={`text-black font-medium ${
                loading ? "cursor-not-allowed opacity-50" : "hover:underline"
              }`}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;