import React from 'react'
import { Navigate } from 'react-router-dom';

const AdminProtect = ({children}) => {
    const accessToken = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("userRole");
  
    if (!accessToken) {
      return <Navigate to="/" />;
    }
  
    if (userRole === "normal") {
      return <Navigate to="/userhome" />;
    }
  
    return children;
}

export default AdminProtect
