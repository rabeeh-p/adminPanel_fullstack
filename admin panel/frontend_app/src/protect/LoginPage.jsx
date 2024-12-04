import React from 'react'
import { Navigate } from "react-router-dom";

const LoginPage = ({ children, redirectTo }) => {
    console.log('logn page protect is working');
    console.log(redirectTo,'iss');
    console.log(children,'iss');
    
    const isAuthenticated = !!localStorage.getItem("access_token"); // Check if token exists
    return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}

export default LoginPage
