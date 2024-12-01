// src/api/auth.js (API Calls)
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}login/`, userData);
    return response.data; // Return token and user info from the response
  } catch (error) {
    throw error.response.data; // Handle error from the backend
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}signup/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
