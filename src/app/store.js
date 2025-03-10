import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice";
import { albumSlice } from "../features/album/albumSlice";
import { imageSlice } from "../features/imageFeature/imageSlice";

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    album: albumSlice.reducer,
    image: imageSlice.reducer,
  },
});
