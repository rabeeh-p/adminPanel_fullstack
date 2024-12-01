// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely parse JSON
const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // Return null as a fallback
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: localStorage.getItem("access_token") || null,
    user: safeParse(localStorage.getItem("user")), // Safely parse user details
  },
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Store user info in localStorage
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
