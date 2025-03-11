import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: 'https://playground-021-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const postImage = createAsyncThunk(
  "image/postImage",
  async ({ albumId, imageData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(imageData).forEach(key => {
        formData.append(key, imageData[key]);
      });

      const response = await api.post(
        `/albums/${albumId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Post Image Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to upload image", error: error.message }
      );
    }
  }
);

export const fetchImages = createAsyncThunk(
  "image/fetchImages",
  async ({ albumId, tags }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/albums/${albumId}/images`, {
        params: tags ? { tags } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Fetch Images Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to fetch images", error: error.message }
      );
    }
  }
);

export const toggleFav = createAsyncThunk(
  "image/toggleFav",
  async ({ albumId, imageId }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/albums/${albumId}/images/${imageId}/favorite`
      );
      return response.data;
    } catch (error) {
      console.error('Toggle Favorite Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to toggle favorite", error: error.message }
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "image/addComment",
  async ({ albumId, imageId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/albums/${albumId}/images/${imageId}/comments`,
        { text }
      );
      return { 
        ...response.data,
        imageId // Explicitly include imageId for use in the reducer
      };
    } catch (error) {
      console.error('Add Comment Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to add comment", error: error.message }
      );
    }
  }
);


export const deleteImage = createAsyncThunk(
  "image/deleteImage",
  async ({ albumId, imageId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/albums/${albumId}/images/${imageId}`
      );
      // Return both the response data and the imageId for use in the reducer
      return { responseData: response.data, imageId };
    } catch (error) {
      console.error('Delete Image Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || 
        { message: "Failed to delete image", error: error.message }
      );
    }
  }
);

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    images: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Images
    builder.addCase(fetchImages.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.images = action.payload.images;
    });
    builder.addCase(fetchImages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to fetch images";
    });

    // Post Image
    builder.addCase(postImage.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(postImage.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.images.push(action.payload.image);
    });
    builder.addCase(postImage.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to upload image";
    });

    // Toggle Favorite
    builder.addCase(toggleFav.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(toggleFav.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.images.findIndex(
        (img) => img._id === action.payload.image._id
      );
      if (index !== -1) {
        state.images[index] = action.payload.image;
      }
    });
    builder.addCase(toggleFav.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to toggle favorite";
    });

    // Delete Image
    builder.addCase(deleteImage.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(deleteImage.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Use the imageId from the action payload instead of trying to access payload.image._id
      state.images = state.images.filter(
        (img) => img._id !== action.payload.imageId
      );
    });
    builder.addCase(deleteImage.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to delete image";
    });

    // Add Comment
builder.addCase(addComment.pending, (state) => {
  state.status = "loading";
  state.error = null;
});
builder.addCase(addComment.fulfilled, (state, action) => {
  state.status = "succeeded";
  // Find the image and add the comment to it
  const imageIndex = state.images.findIndex(
    (img) => img._id === action.payload.imageId
  );
  if (imageIndex !== -1) {
    // If the image is found, push the new comment
    if (!state.images[imageIndex].comments) {
      state.images[imageIndex].comments = [];
    }
    state.images[imageIndex].comments.push(action.payload.comment);
  }
});
builder.addCase(addComment.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload?.message || "Failed to add comment";
});

  },
});

export const { clearError } = imageSlice.actions;
export default imageSlice.reducer;