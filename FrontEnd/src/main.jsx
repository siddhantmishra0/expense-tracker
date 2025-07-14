import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from "./components/Layout"
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Budget from './components/Budget.jsx'
import Dashboard from './components/Dashboard.jsx'
import Expenses from './components/Expenses.jsx'
import Insights from './components/Insights'
import Report from './components/Report.jsx'
import App from './App.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

// const  router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path='/' element={<Register/>}>
//       <Route path='home' element={<Layout/>}/>
//       <Route path='login' element={<Login/>}/>
//       <Route path='register' element={<Register/>}/>
//       <Route path='budget' element={<Budget/>}/>
//       <Route path='dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
//       <Route path='expenses' element={<Expenses/>}/>
//       <Route path='insights' element={<Insights/>}/>
//       <Route path='report' element={<Report/>}/>
//     </Route>
//   )
// );

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <App/>
  </StrictMode>,
)
