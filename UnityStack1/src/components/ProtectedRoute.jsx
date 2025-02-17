import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect if role is not allowed
  }

  return <Outlet />; // Render the page if authenticated
};

export default ProtectedRoute;
