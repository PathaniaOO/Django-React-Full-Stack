import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Notfound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Header"


function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterandLogout(){
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
    <Route
      path="/"
      element={
        <Home />
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/register" element={<RegisterandLogout />} />
    <Route path="*" element={<Notfound />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
