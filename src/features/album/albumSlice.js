import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postAlbum = createAsyncThunk(
  "album/postAlbum",
  async (newAlbum, { rejectWithValue }) => {
    try {
      const response = await api.post("/albums", newAlbum);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ message: "No authentication token found" });
      }

      const response = await api.get("/albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Fetch Albums Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch albums",
          error: error.message,
        }
      );
    }
  }
);

export const fetchAlbumDetails = createAsyncThunk(
  "album/fetchAlbumDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/albums/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSharedAlbums = createAsyncThunk(
  "album/fetchSharedAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "No authentication token found" });
      }
      const response = await api.get("/albums/shared");
      return response.data;
    } catch (error) {
      console.error(
        "Fetch Shared Albums Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch shared albums",
          error: error.message,
        }
      );
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "album/updateAlbum",
  async ({ id, albumData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/albums/${id}`, albumData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "album/deleteAlbum",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/albums/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSharedUsers = createAsyncThunk(
  "album/addSharedUsers",
  async ({ id, usernames }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/albums/${id}/share`, { usernames });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const albumSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    albumDetails: null,
    sharedAlbums: [],

    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Post Album
    builder.addCase(postAlbum.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postAlbum.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.albums.push(action.payload.album);
    });
    builder.addCase(postAlbum.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Fetch Albums
    builder.addCase(fetchAlbums.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAlbums.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.albums = action.payload.albums;
    });
    builder.addCase(fetchAlbums.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Fetch Album Details
    builder.addCase(fetchAlbumDetails.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAlbumDetails.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.albumDetails = action.payload;
    });
    builder.addCase(fetchAlbumDetails.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Fetch Shared Albums
    builder.addCase(fetchSharedAlbums.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSharedAlbums.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sharedAlbums = action.payload.albums;
    });
    builder.addCase(fetchSharedAlbums.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Update Album
    builder.addCase(updateAlbum.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateAlbum.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.albums.findIndex(
        (album) => album._id === action.payload.album._id
      );
      if (index !== -1) {
        state.albums[index] = action.payload.album;
      }
      state.albumDetails = action.payload.album;
    });
    builder.addCase(updateAlbum.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Delete Album
    builder.addCase(deleteAlbum.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteAlbum.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.albums = state.albums.filter(
        (album) => album._id !== action.payload.album._id
      );
    });
    builder.addCase(deleteAlbum.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // Add Shared Users
    builder.addCase(addSharedUsers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(addSharedUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.albums.findIndex(
        (album) => album._id === action.payload.album._id
      );
      if (index !== -1) {
        state.albums[index] = action.payload.album;
      }
      state.albumDetails = action.payload.album;
    });
    builder.addCase(addSharedUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default albumSlice.reducer;
