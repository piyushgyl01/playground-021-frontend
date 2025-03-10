import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import Auth from "./features/auth/Auth.jsx";
import Homepage from "./Homepage.jsx";
import CreateAlbum from "./pages/CreateAlbum.jsx";
import AlbumDetails from "./pages/AlbumDetails.jsx";
import AddImage from "./pages/AddImage.jsx";
import SharedAlbums from "./pages/SharedAlbums.jsx";
import AlbumsPage from "./pages/AlbumsPage.jsx";
import Layout from "./components/Layout.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
    ],
  },
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
]);

export default router;
