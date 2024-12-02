// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios for making API requests

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
    user: safeParse(localStorage.getItem("user")),
  },
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      const logoutRequest = async () => {
        try {
          // Make a request to the backend to log the user out
          await axios.post("http://127.0.0.1:8000/api/logout/", null, {
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
            },
          });

          // After logging out, clear localStorage and Redux state
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Logout request failed", error);
        }
      };

      logoutRequest(); // Call the logout request

      // Clear Redux state
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
