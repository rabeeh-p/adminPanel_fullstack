// src/redux/auth.js (Redux Slice)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("access_token") || null,
  user: null, // Store user data (e.g., username)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
