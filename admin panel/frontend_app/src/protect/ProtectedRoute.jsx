import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("userRole");

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  if (userRole === "superuser") {
    return <Navigate to="/adminhome" />;
  }

  return children;
};

export default ProtectedRoute;
