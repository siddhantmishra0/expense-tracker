import React, { useEffect, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

const Login = () => {
  // const [isRegistering, setIsRegistering] = useState(false);
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = (e) =>{
    e.preventDefault();
      axios.post("http://localhost:3000/login",{username,password},{
        withCredentials: true
      })
      .then(result => {console.log(result)
        try {
          if(result.data.status === "success"){
              navigate("/home")
              toast.success("Login Successfull, Welcome!")
          } 
          else{
            toast.error("Invalid credentials!")
          }
        } catch (error) {
          console.log("Login error ",error)
        }
        }
        )
        .catch(err=> console.log("Axios handle error ",err))
      }
    
  
      

  return (
    <div className="flex items-center justify-center w-screen px-4 mt-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md border-2">
        {/* Heading */}
        <h2 className="text-2xl sm:text-2xl font-semibold text-center mb-1">Expense Tracker</h2>
        <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
          Sign in to manage your expenses
        </p>

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden border-2">
          <button
            // onClick={() => setIsRegistering(false)}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-white shadow text-black`}
          >
            Login
          </button>
          <button
            // onClick={() => setIsRegistering(true) }
            onClick={()=>navigate("/register")}
            className={`w-1/2 py-2 font-medium text-sm sm:text-base transition bg-gray-150 shadow text-gray-500`}
            
          >
            Register
          </button>
        </div>

        {/* Register Form */}
       
          <form className="space-y-4 border rounded-lg p-4 sm:p-6" onSubmit={handleSubmit}>
            
            
            <div>
              <label className="block mb-1 font-medium text-sm">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            
            
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
            >Login
            </button>
          </form>
      </div>
    </div>
  );
};

export default Login;
