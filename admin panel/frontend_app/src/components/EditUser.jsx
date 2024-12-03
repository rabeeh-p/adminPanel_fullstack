import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user-home/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFormData({
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          phone_number: response.data.phone_number,
          image: null, // Image will be updated separately
        });
      } catch (err) {
        setError("Failed to load user details.");
      }
    };

    if (accessToken) {
      fetchUserDetails();
    }
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Real-time validation
    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Invalid email format.");
    } else if (name === "phone_number" && value && isNaN(value)) {
      setError("Phone number must contain only digits.");
    } else if (!value.trim()) {
      setError(`${name.replace("_", " ")} cannot be empty or spaces only.`);
    } else {
      setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty or invalid fields
    for (const [key, value] of Object.entries(formData)) {
      if (key !== "image" && (!value || !value.trim())) {
        setError(`${key.replace("_", " ")} cannot be empty or spaces only.`);
        return;
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (formData.phone_number && isNaN(formData.phone_number)) {
      setError("Phone number must contain only digits.");
      return;
    }

    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      updateData.append(key, formData[key]);
    });

    try {
      await axios.put("http://127.0.0.1:8000/user-update/", updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Profile updated successfully.");
      setTimeout(() => navigate("/userhome"), 2000); // Redirect after success
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Edit Profile</h2>
        {error && <p style={styles.errorText}>{error}</p>}
        {successMessage && <p style={styles.successText}>{successMessage}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            style={styles.input}
          />

          <label style={styles.label}>Profile Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.fileInput}
          />

          <button type="submit" style={styles.submitButton}>
            Save Changes
          </button>
        </form>
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
  formContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  errorText: {
    color: "#e74c3c",
    margin: "10px 0",
  },
  successText: {
    color: "#2ecc71",
    margin: "10px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  fileInput: {
    padding: "5px",
    fontSize: "16px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
};

export default EditProfilePage;
