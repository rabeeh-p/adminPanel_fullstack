// src/components/UserHomePage.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Redirect } from "react-router-dom";
import { logout } from "../redux/userSlice";

const UserHomePage = () => {
  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  // Redirect if user is not logged in

  if (!accessToken) {
    return <Navigate to="/login" />;
  }



  



  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="user-home-page">
      <h2>Welcome, {user?.username}</h2>
      <div className="profile-box">
        <h3>Profile</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};


export default UserHomePage;

// import React from 'react'

// const UserHome = () => {
//   return (
//     <div>
//         <h1>hello</h1>
      
//     </div>
//   )
// }

// export default UserHome

