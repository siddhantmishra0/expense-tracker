import React, { useState } from "react";
import api from "../apiClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  // const [isRegistering, setIsRegistering] = useState(true);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      toast.error("password and confirm password different");
      return;
    }
    api
      .post("/register", { username, email, password })
      .then((result) => {
        console.log(result);
        toast.success("Registered successfully. Please login!");
        navigate("/login");
      })
      .catch((error) => {
        console.log("submit error ", error);
        toast.error("Registration failed. Please try again");
      });
  };

  return (
    <div className="flex items-center justify-center w-screen px-4 mt-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2">
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
            onClick={() => navigate("/login")}
            // onClick={() => setIsRegistering(false)}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition 
             bg-gray-150 shadow text-gray-500 
            `}
          >
            Login
          </button>
          <button
            // onClick={() => setIsRegistering(true)}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black`}
          >
            Register
          </button>
        </div>

        {/* Register Form */}

        <form
          className="space-y-4 border rounded-lg p-4 sm:p-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-1 font-medium text-sm">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm ${
                confirmPassword != password ? "border-red-500" : ""
              }`}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
