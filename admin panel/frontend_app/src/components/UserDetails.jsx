import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useParams } from "react-router-dom"; 

const UserDetails = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://127.0.0.1:8000/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUser(response.data); 
        console.log(response.data, 'data person');
        setLoading(false);
      } catch (error) {
        setError("Failed to load user details.");
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]); 

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
        User Details
      </h2>
      {user ? (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            {user.profile?.image ? (
              <img
                src={`http://127.0.0.1:8000${user.profile.image}`}
                alt="Profile"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{ width: "150px", height: "150px", borderRadius: "50%", backgroundColor: "#ccc" }}></div>
            )}
          </div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Phone:</strong> {user.profile?.phone_number || "Not available"}</p>
          <p><strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
          <p><strong>Account Active:</strong> {user.is_active ? "Yes" : "No"}</p>
          <p><strong>Is Staff:</strong> {user.is_staff ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p>User data is not available.</p>
      )}
    </div>
  );
};

export default UserDetails;
