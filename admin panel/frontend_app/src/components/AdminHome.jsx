import React, { useState, useEffect } from "react";
import { getUsers } from "../api/auth"; // Assume you have an API function to get users
import { useNavigate } from "react-router-dom";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(); // This fetches all users
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to handle viewing a user's details
  const handleViewUser = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading users...</div>;
  }

  // If there's an error, show the error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin User List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone || "Not available"}</td>
              <td>
                <button
                  onClick={() => handleViewUser(user.id)}
                  style={styles.viewButton}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px",
  },
  tableRow: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
  },
  viewButton: {
    padding: "6px 12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminUserList;
