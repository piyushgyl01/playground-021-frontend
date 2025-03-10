import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import PrivateRoute from "./PrivateRoute.jsx";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import store from "./app/store.js";

import Auth from "./features/auth/Auth.jsx";
import Homepage from "./Homepage.jsx";
import CreateAlbum from "./pages/CreateAlbum.jsx";
import AlbumDetails from "./pages/AlbumDetails.jsx";
import AddImage from "./pages/AddImage.jsx";
import SharedAlbums from "./pages/SharedAlbums.jsx";
import AlbumsPage from "./pages/AlbumsPage.jsx";
import App from "./App.jsx";


// src/router.js
const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Homepage />
        </PrivateRoute>
      ),
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/create-album",
      element: (
        <PrivateRoute>
          <CreateAlbum />
        </PrivateRoute>
      ),
    },
    {
      path: "/album/:albumId",
      element: (
        <PrivateRoute>
          <AlbumDetails />
        </PrivateRoute>
      ),
    },
    {
      path: "/album/addImage/:albumId",
      element: (
        <PrivateRoute>
          <AddImage />
        </PrivateRoute>
      ),
    },
    {
      path: "/albums/shared",
      element: (
        <PrivateRoute>
          <SharedAlbums />
        </PrivateRoute>
      ),
    },
    {
      path: "/albums",
      element: (
        <PrivateRoute>
          <AlbumsPage />
        </PrivateRoute>
      ),
    },
  ]);
  
  export default router;