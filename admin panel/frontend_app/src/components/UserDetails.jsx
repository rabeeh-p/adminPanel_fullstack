import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [formErrors, setFormErrors] = useState({});  

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
    setIsEditing(!isEditing);  
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "phone_number" || name === "first_name" || name === "last_name" || name === "email") {
      const newValue = value.replace(/\s/g, '');
      setFormData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.first_name) errors.first_name = "First name is required.";
    if (!formData.last_name) errors.last_name = "Last name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.phone_number) errors.phone_number = "Phone number is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

      setUser(response.data);  
      setIsEditing(false);  
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
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
        User Details
      </h2>
      {user ? (
        <div style={{ maxWidth: "600px", margin: "auto", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
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
                  marginBottom: "10px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  marginBottom: "10px",
                }}
              ></div>
            )}
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
              <strong>Account Active:</strong> {user.profile.blocked ? "NO" : "Yes"}
            </p>

            <button
              onClick={handleEditToggle}
              style={{
                padding: "10px 20px",
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

          {isEditing && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <label>
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  style={{ padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                {formErrors.first_name && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.first_name}</span>}
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  style={{ padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                {formErrors.last_name && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.last_name}</span>}
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                {formErrors.email && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.email}</span>}
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  style={{ padding: "10px", margin: "5px 0", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                {formErrors.phone_number && <span style={{ color: "red", fontSize: "12px" }}>{formErrors.phone_number}</span>}
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
          )}
        </div>
      ) : (
        <p>User data is not available.</p>
      )}
    </div>
  );
};

export default UserDetails;
