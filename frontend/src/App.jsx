import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
