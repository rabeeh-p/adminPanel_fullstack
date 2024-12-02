import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/userSlice";

const UserHomePage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user-home/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserDetails(response.data);
      } catch (err) {
        setError("Failed to fetch user details. Please try again.");
      }
    };

    if (accessToken) {
      fetchUserDetails();
    }
  }, [accessToken]);

  // Redirect if user is not logged in
  if (!accessToken) {
    return <Navigate to="/" />;
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <h2 style={styles.welcomeText}>Welcome, {userDetails?.username}</h2>
        
        {error && <p style={styles.errorText}>{error}</p>}
        
        {userDetails ? (
          <div style={styles.profileBox}>
            <h3 style={styles.profileTitle}>Profile Details</h3>
            
            {userDetails.image && (
              <img
                src={userDetails.image}
                alt={`${userDetails.username}'s Profile`}
                style={styles.profileImage}
              />
            )}
            
            <div style={styles.details}>
              <p style={styles.detailsText}><strong>Username:</strong> {userDetails.username}</p>
              <p style={styles.detailsText}><strong>Email:</strong> {userDetails.email}</p>
              <p style={styles.detailsText}><strong>First Name:</strong> {userDetails.first_name}</p>
              <p style={styles.detailsText}><strong>Last Name:</strong> {userDetails.last_name}</p>
              <p style={styles.detailsText}><strong>Ph number:</strong> {userDetails.phone_number}</p>
            </div>
            
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </div>
        ) : (
          <p style={styles.loadingText}>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "20px",
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  errorText: {
    color: "#e74c3c",
    margin: "10px 0",
  },
  profileBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  profileTitle: {
    fontSize: "20px",
    color: "#333",
    fontWeight: "600",
    marginBottom: "20px",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "20px",
    objectFit: "cover",
  },
  details: {
    width: "100%",
    marginBottom: "20px",
  },
  detailsText: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  logoutButtonHover: {
    backgroundColor: "#2980b9",
  },
  loadingText: {
    fontSize: "16px",
    color: "#777",
  },
};

export default UserHomePage;
