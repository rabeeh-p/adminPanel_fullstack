import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { blockUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const AdminAddUsers = () => {
    const [newUser, setNewUser] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      const [error, setError] = useState("");
      const navigate = useNavigate();
      const dispatch = useDispatch();
    
      const handleAddUser = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.post(
            "http://127.0.0.1:8000/add-user/",
            newUser,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          // Successfully added user
          alert("User added successfully.");
          console.log("API Response:", response.data);
          
          // Example: If the user should start in a blocked state, dispatch blockUser
          const newUserId = response.data.id; // Assume the new user's ID is returned
          dispatch(blockUser(newUserId));
    
          // Navigate to admin home
          navigate("/adminhome");
        } catch (err) {
          setError("Failed to add user.");
          console.error(err);
        }
      };
    
      return (
        <div style={{ padding: "20px", backgroundColor: "#f4f7fc" }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Add New User</h2>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              placeholder="username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUser.first_name}
              onChange={(e) =>
                setNewUser({ ...newUser, first_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.last_name}
              onChange={(e) =>
                setNewUser({ ...newUser, last_name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={handleAddUser}
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
          {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        </div>
  )
}

export default AdminAddUsers
