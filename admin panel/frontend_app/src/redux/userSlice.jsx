import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: localStorage.getItem("access_token") || null,
    user: safeParse(localStorage.getItem("user")),
    blockedUsers: [], 
  },
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      const fetchBlockedUsers = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/blocked-users/", {
            headers: {
              Authorization: `Bearer ${action.payload.accessToken}`,
            },
          });
          const blockedUsers = response.data;
          state.blockedUsers = blockedUsers; 
        } catch (error) {
          console.error("Error fetching blocked users:", error);
        }
      };

      fetchBlockedUsers(); 
    },
    logout: (state) => {
      const logoutRequest = async () => {
        try {
          await axios.post("http://127.0.0.1:8000/api/logout/", null, {
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
            },
          });

          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Logout request failed", error);
        }
      };

      logoutRequest();

      state.accessToken = null;
      state.user = null;
      state.blockedUsers = []; 
    },
    blockUser: (state, action) => {
      if (!state.blockedUsers.includes(action.payload)) {
        state.blockedUsers.push(action.payload); 
      }
    },
    unblockUser: (state, action) => {
      state.blockedUsers = state.blockedUsers.filter((userId) => userId !== action.payload); 
    },
  },
});

export const { setUser, logout, blockUser, unblockUser } = userSlice.actions;

export default userSlice.reducer;
