import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoutes from './components/ProtectedRoutes'
import { useState } from 'react'

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
