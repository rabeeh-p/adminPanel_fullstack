import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

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
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone_number: response.data.profile?.phone_number || "",
        });
        setLoading(false);
      } catch (error) {
        setError("Failed to load user details.");
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle between edit and view mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `http://127.0.0.1:8000/users/edit/${userId}/`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          profile: {
            phone_number: formData.phone_number,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data); // Update state with updated user data
      setIsEditing(false); // Exit edit mode
      alert("User details updated successfully.");
    } catch (error) {
      setError("Failed to update user details.");
      console.error("Error updating user details:", error);
    }
  };

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
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                }}
              ></div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </label>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Full Name:</strong> {user.first_name} {user.last_name}
              </p>
              <p>
                <strong>Phone:</strong> {user.profile?.phone_number || "Not available"}
              </p>
              <p>
                <strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}
              </p>
              <p>
                <strong>Account Active:</strong> {user.profile.blocked ? "NO" : "Yes"}
              </p>
              <button
                onClick={handleEditToggle}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  marginTop: "20px",
                }}
              >
                Edit User Details
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>User data is not available.</p>
      )}
    </div>
  );
};

export default UserDetails;

