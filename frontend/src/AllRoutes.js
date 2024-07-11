import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Activity from "./components/Activity";

const AllRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('userId'); // Check if user is authenticated

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={isAuthenticated ? <Activity /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AllRoutes;

