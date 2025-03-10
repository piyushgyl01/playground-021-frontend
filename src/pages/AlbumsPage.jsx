import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAlbums, deleteAlbum } from "../features/album/albumSlice";
import {
  BsThreeDotsVertical,
  BsCollection,
  BsCalendarDate,
  BsPlus,
} from "react-icons/bs";

export default function Albums() {
  const dispatch = useDispatch();
  const { albums, status, error } = useSelector((state) => state.album);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  // Generate a random pastel color for album cover
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const handleDelete = (albumId) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      dispatch(deleteAlbum(albumId));
    }
  };

  if (status === "loading") {
    return (
      <div
        className="container d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Error Loading Albums</h4>
          <p>
            {error ||
              "There was a problem loading your albums. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">Your Photo Albums</h1>
              <p className="text-muted mb-0">
                Organize and browse your memories
              </p>
            </div>
            <Link
              to="/create-album"
              className="btn btn-primary d-flex align-items-center gap-2 px-4"
            >
              <BsPlus size={24} />
              <span>Create Album</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Albums grid */}
      <div className="row">
        {albums.length > 0 ? (
          albums.map((album) => {
            const formattedDate = album.createdAt
              ? new Date(album.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown date";

            return (
              <div key={album._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center text-white"
                    style={{
                      backgroundImage: album.albumCover
                        ? `url(${album.albumCover})`
                        : null,
                      backgroundColor: !album.albumCover
                        ? album.coverColor || getRandomColor()
                        : null,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "180px",
                      position: "relative",
                    }}
                  >
                    <div className="bg-dark bg-opacity-50 w-100 h-100 d-flex align-items-center justify-content-center position-absolute">
                      <h3 className="m-0 text-center px-3">{album.name}</h3>
                    </div>
                    <div className="position-absolute top-0 end-0 mt-2 me-2">
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-light rounded-circle shadow-sm"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <BsThreeDotsVertical />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                          <li>
                            <Link
                              to={`/create-album`}
                              state={album}
                              className="dropdown-item"
                            >
                              <i className="bi bi-pencil me-2"></i> Edit Album
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDelete(album._id)}
                            >
                              <i className="bi bi-trash me-2"></i> Delete Album
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">{album.name}</h5>
                    <p
                      className="card-text text-muted mb-3"
                      style={{ minHeight: "48px" }}
                    >
                      {album.description || "No description available."}
                    </p>
                    <div className="d-flex align-items-center text-muted small mb-3">
                      <BsCalendarDate className="me-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <Link
                      to={`/album/${album._id}`}
                      state={{ isSharedAlbum: false }}
                      className="btn btn-outline-primary w-100"
                    >
                      View Album
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-md-8 col-lg-6 mx-auto">
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <div className="mb-4">
                  <BsCollection size={48} className="text-muted" />
                </div>
                <h3 className="card-title mb-3">No Albums Found</h3>
                <p className="card-text text-muted mb-4">
                  Start organizing your memories by creating your first album.
                  You can add photos, descriptions, and share with friends and
                  family.
                </p>
                <Link to="/create-album" className="btn btn-primary px-4">
                  Create Your First Album
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for hover effect */}
      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
