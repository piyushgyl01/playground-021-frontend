// features/profile/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: 'https://playground-021-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add the auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Fetch user profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Fetch Profile Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to fetch profile", error: error.message }
      );
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update Profile Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to update profile", error: error.message }
      );
    }
  }
);

// Update user password
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Update Password Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to update password", error: error.message }
      );
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    passwordStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    passwordError: null,
    message: null,
    passwordMessage: null
  },
  reducers: {
    clearProfileMessage: (state) => {
      state.message = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
    clearPasswordMessage: (state) => {
      state.passwordMessage = null;
    },
    clearPasswordError: (state) => {
      state.passwordError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to fetch profile";
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.message = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.message = "Profile updated successfully";
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update profile";
    });

    // Update Password
    builder.addCase(updatePassword.pending, (state) => {
      state.passwordStatus = "loading";
      state.passwordError = null;
      state.passwordMessage = null;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.passwordStatus = "succeeded";
      state.passwordMessage = "Password updated successfully";
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.passwordStatus = "failed";
      state.passwordError = action.payload?.message || "Failed to update password";
    });
  }
});

export const { 
  clearProfileMessage, 
  clearProfileError, 
  clearPasswordMessage, 
  clearPasswordError 
} = profileSlice.actions;

export default profileSlice.reducer;