import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import GettingStarted from "./components/GettingStarted";
import Dashboard from "./components/Dashboard";
import Budget from "./components/Budget";
import Expenses from "./components/Expenses";
import Report from "./components/Report";
import Insights from "./components/Insights";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
    // const navigate = useNavigate();

    useEffect(() => {
      const handlePopState = () => {
        // Clear access token from cookies/localStorage
        // localStorage.removeItem("accessToken"); // if you’re storing it in localStorage
        document.cookie = "accessToken=; Max-Age=0; path=/;"; // if in cookies

        // Redirect to GettingStarted page
        // navigate("/");
        window.location.href ="/"
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }, []);
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GettingStarted />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Navbar />}>
            <Route index element={<Dashboard />} />
            <Route path="budget" element={<Budget />} />
            <Route path="expense" element={<Expenses />} />
            <Route path="report" element={<Report />} />
            <Route path="insight" element={<Insights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
