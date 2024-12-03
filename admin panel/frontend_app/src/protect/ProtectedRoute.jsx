import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("userRole");

  // Redirect if the user doesn't have an access token
  if (!accessToken) {
    return <Navigate to="/" />;
  }

  // Redirect if the user is a superuser
  if (userRole === "superuser") {
    return <Navigate to="/adminhome" />;
  }

  // If everything is fine, render the protected content (children)
  return children;
};

export default ProtectedRoute;
