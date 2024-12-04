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
    userRole: localStorage.getItem('userRole') || null,
    user: safeParse(localStorage.getItem("user")),
    blockedUsers: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.userRole = action.payload.user.is_superuser ? "superuser" : "normal"; // Set role based on user data
      console.log(state.userRole,'userroleeeee');
      
      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userRole", state.userRole);

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
      console.log("Access Token:", state.accessToken);
      const logoutRequest = async (accessToken) => {
        try {
          // await axios.post(
          //   "http://127.0.0.1:8000/logout/",
          //   {}, // Body (empty in this case)
          //   {
          //     headers: {
          //       Authorization: `Bearer ${accessToken}`,
          //     },
          //   }
          // );
         

    
          // Remove items from localStorage
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
    
          console.log("Logout successful");
        } catch (error) {
          console.log("Access Token");
          console.error("Logout request failed", error);
        }
      };
    
      // Call the logout request with the current access token
      const accessToken = state.accessToken; // Extract token from state
      if (accessToken) {
        logoutRequest(accessToken);
      }
    
      // Reset Redux state
      state.accessToken = null;
      state.user = null;
      state.userRole = null;
    },
    
    blockUser: (state, action) => {
      if (!state.blockedUsers.includes(action.payload)) {
        state.blockedUsers.push(action.payload);
      }
    },
    unblockUser: (state, action) => {
      state.blockedUsers = state.blockedUsers.filter((userId) => userId !== action.payload);
    },
    setRole: (state, action) => {
      state.role = action.payload; // Allow manual role setting if needed
    },
  },
});

export const { setUser, logout, blockUser, unblockUser, setRole } = userSlice.actions;

export default userSlice.reducer;
