import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";


export const loginUser = async (formData) => {
  const response = await fetch("http://127.0.0.1:8000/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json(); 
};


export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}signup/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getUsers = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}admin/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,  
    },
  });
  return response;
};