import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        image: null,
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0], // store the file
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("username", formData.username);
        form.append("email", formData.email);
        form.append("password", formData.password);
        form.append("phone_number", formData.phone_number);
        if (formData.image) form.append("image", formData.image);

        try {
            const response = await axios.post("http://127.0.0.1:8000/signup/", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Signup failed. Please try again.");
        }
    };

    const formStyles = {
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    };

    const inputStyles = {
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
    };

    const labelStyles = {
        fontWeight: "bold",
        marginBottom: "5px",
    };

    const buttonStyles = {
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    };

    const messageStyles = {
        textAlign: "center",
        marginTop: "20px",
        color: "#333",
        fontSize: "18px",
    };

    return (
        <div style={{ textAlign: "center" ,marginTop:'90px' }}>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit} style={formStyles}>
                <div>
                    <label style={labelStyles}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={labelStyles}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={labelStyles}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={labelStyles}>Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>
                <div>
                    <label style={labelStyles}>Profile Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        style={inputStyles}
                    />
                </div>
                <button type="submit" style={buttonStyles}>Signup</button>
            </form>
            {message && <p style={messageStyles}>{message}</p>}
        </div>
    );
};

export default Signup;
