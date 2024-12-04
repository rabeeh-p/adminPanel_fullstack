import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import axios from "axios";
import { blockUser, unblockUser } from "../redux/userSlice"; // Import actions

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const blockedUsers = useSelector((state) => state.user.blockedUsers);
  const userRole = useSelector((state) => state.user.role);

  const sample = localStorage.getItem('userRole');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/users-list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError("Unexpected response format.");
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleBlockUser = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");

      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        alert("User not found.");
        return;
      }

      const user = users[userIndex];

      const response = await axios.put(
        `http://127.0.0.1:8000/block-unblock-user/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = [...users];
      updatedUsers[userIndex].profile.blocked = !updatedUsers[userIndex].profile.blocked;

      setUsers(updatedUsers);

      if (updatedUsers[userIndex].profile.blocked) {
        dispatch(blockUser(userId));
        alert("User blocked successfully.");
      } else {
        dispatch(unblockUser(userId));
        alert("User unblocked successfully.");
      }
    } catch (error) {
      alert("Failed to change user status.");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading users...!</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f7fc" }}>
      <h2
        style={{
          fontSize: "26px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "30px",
          color: "#2c3e50",
        }}
      >
        Admin User List
      </h2>
      <button
        onClick={() => navigate("/admin-add-user")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Add User
      </button>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by first name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#3498db",
              color: "white",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "12px 15px" }}>First Name</th>
            <th style={{ padding: "12px 15px" }}>Last Name</th>
            <th style={{ padding: "12px 15px" }}>Email</th>
            <th style={{ padding: "12px 15px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              style={{
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
              }}
            >
              <td style={{ padding: "12px 15px" }}>{user.first_name}</td>
              <td style={{ padding: "12px 15px" }}>{user.last_name}</td>
              <td style={{ padding: "12px 15px" }}>{user.email}</td>
              <td style={{ padding: "12px 15px", textAlign: "center" }}>
                <button
                  onClick={() => handleViewUser(user.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    marginRight: "10px",
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleBlockUser(user.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: user.profile.blocked
                      ? "#e74c3c"
                      : "#2ecc71",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {user.profile.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
