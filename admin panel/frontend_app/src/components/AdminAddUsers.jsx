import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const validateFields = () => {
        const { username, first_name, last_name, email, password } = newUser;

        // Check for empty fields
        if (!username.trim() || !first_name.trim() || !last_name.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required and cannot contain only spaces.");
            return false;
        }

        // Check for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        setError("");
        return true;
    };

    const handleAddUser = async () => {
        if (!validateFields()) return;

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

            alert("User added successfully.");
            console.log("API Response:", response.data);

            navigate("/adminhome");
        } catch (err) {
            setError("Failed to add user.");
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Add New User</h2>
            <form style={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                    }
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={newUser.first_name}
                    onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                    }
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newUser.last_name}
                    onChange={(e) =>
                        setNewUser({ ...newUser, last_name: e.target.value })
                    }
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                    }
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                    }
                    style={styles.input}
                />
                <button
                    type="button"
                    onClick={handleAddUser}
                    style={styles.button}
                >
                    Submit
                </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        textAlign: "center",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        margin: "10px 0",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    button: {
        marginTop: "20px",
        padding: "10px 15px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#3498db",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    error: {
        color: "red",
        marginTop: "15px",
    },
};

export default AdminAddUsers;
