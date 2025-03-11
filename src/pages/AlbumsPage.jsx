import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  fetchAlbums, 
  deleteAlbum, 
  fetchSharedAlbums, 
  addSharedUsers, 
  fetchAlbumDetails 
} from "../features/album/albumSlice";
import {
  BsThreeDotsVertical,
  BsCollection,
  BsCalendarDate,
  BsPlus,
  BsPeople,
  BsExclamationCircle,
  BsCheckCircle,
  BsArrowLeft
} from "react-icons/bs";

export default function Albums() {
  const dispatch = useDispatch();
  const { albums, sharedAlbums, albumDetails, status, error } = useSelector((state) => state.album);
  
  // Local state
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [showSharedAlbums, setShowSharedAlbums] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [usernames, setUsernames] = useState('');
  const [shareStatus, setShareStatus] = useState('idle'); // idle, loading, succeeded, failed
  const [shareError, setShareError] = useState(null);
  const [shareFormValid, setShareFormValid] = useState(true);

  // Fetch albums when component mounts
  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  // Fetch shared albums when toggling to shared view
  useEffect(() => {
    if (showSharedAlbums) {
      dispatch(fetchSharedAlbums());
    }
  }, [showSharedAlbums, dispatch]);

  // Fetch album details when opening share modal
  useEffect(() => {
    if (currentAlbumId) {
      dispatch(fetchAlbumDetails(currentAlbumId));
    }
  }, [currentAlbumId, dispatch]);

  // Generate a random pastel color for album cover
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const handleDelete = (albumId) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      setDeleteInProgress(true);
      dispatch(deleteAlbum(albumId)).then(() => {
        setDeleteInProgress(false);
      });
    }
  };

  const openShareModal = (albumId) => {
    setCurrentAlbumId(albumId);
    setUsernames('');
    setShareStatus('idle');
    setShareError(null);
    setShareFormValid(true);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setCurrentAlbumId(null);
    setUsernames('');
    setShareStatus('idle');
  };

  const handleShareSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!usernames.trim()) {
      setShareFormValid(false);
      return;
    }
    
    setShareFormValid(true);
    setShareStatus('loading');
    
    // Parse usernames (separated by commas, spaces, or both)
    const usernameArray = usernames
      .split(/[\s,]+/) // Split by commas or whitespace
      .filter(username => username.trim() !== ''); // Remove empty strings
    
    dispatch(addSharedUsers({
      id: currentAlbumId,
      usernames: usernameArray
    }))
      .unwrap()
      .then(() => {
        setShareStatus('succeeded');
        // Refresh album details to show updated shared users
        dispatch(fetchAlbumDetails(currentAlbumId));
        
        // Auto-close after success with delay
        setTimeout(() => {
          closeShareModal();
          // Also refresh albums list to update sharing indicators
          dispatch(fetchAlbums());
        }, 2000);
      })
      .catch((err) => {
        setShareStatus('failed');
        setShareError(err.message || 'Failed to share album');
      });
  };

  // Helper function to determine if loading state should be shown
  const showLoading = () => {
    return status === "loading" && !deleteInProgress && !showShareModal;
  };

  // Helper function to determine if error state should be shown
  const showError = () => {
    return status === "failed" && !deleteInProgress && !showShareModal;
  };

  if (showLoading()) {
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

  if (showError()) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Error Loading Albums</h4>
          <p>
            {error ||
              "There was a problem loading your albums. Please try again later."}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => showSharedAlbums ? dispatch(fetchSharedAlbums()) : dispatch(fetchAlbums())}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine which albums to display
  const albumsToDisplay = showSharedAlbums ? sharedAlbums : albums;

  return (
    <div className="container py-5">
      {/* Header section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="fw-bold mb-1">
                {showSharedAlbums ? "Shared With You" : "Your Photo Albums"}
              </h1>
              <p className="text-muted mb-0">
                {showSharedAlbums 
                  ? "Albums that other users have shared with you" 
                  : "Organize and browse your memories"}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={() => setShowSharedAlbums(!showSharedAlbums)}
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                {showSharedAlbums ? (
                  <>
                    <BsArrowLeft size={20} />
                    <span>My Albums</span>
                  </>
                ) : (
                  <>
                    <BsPeople size={20} />
                    <span>Shared Albums</span>
                  </>
                )}
              </button>
              
              {!showSharedAlbums && (
                <Link
                  to="/create-album"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4"
                >
                  <BsPlus size={24} />
                  <span>Create Album</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Albums grid */}
      <div className="row">
        {albumsToDisplay && albumsToDisplay.length > 0 ? (
          albumsToDisplay.map((album) => {
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
                    
                    {/* Shared badge if album is shared */}
                    {album.sharedUsers && album.sharedUsers.length > 0 && !showSharedAlbums && (
                      <div className="position-absolute top-0 start-0 mt-2 ms-2">
                        <span className="badge bg-info text-white d-flex align-items-center gap-1">
                          <BsPeople size={14} />
                          <span>{album.sharedUsers.length}</span>
                        </span>
                      </div>
                    )}
                    
                    {/* Shared with you badge for shared albums */}
                    {showSharedAlbums && (
                      <div className="position-absolute top-0 start-0 mt-2 ms-2">
                        <span className="badge bg-info text-white">
                          Shared with you
                        </span>
                      </div>
                    )}
                    
                    {/* Album options dropdown (only for own albums) */}
                    {!showSharedAlbums && (
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
                              <button
                                onClick={() => openShareModal(album._id)}
                                className="dropdown-item"
                              >
                                <i className="bi bi-people me-2"></i> Share Album
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(album._id)}
                                disabled={deleteInProgress}
                              >
                                <i className="bi bi-trash me-2"></i> Delete Album
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">{album.name}</h5>
                    <p
                      className="card-text text-muted mb-3"
                      style={{ minHeight: "48px" }}
                    >
                      {album.description || "No description available."}
                    </p>
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                      <div className="d-flex align-items-center">
                        <BsCalendarDate className="me-2" />
                        <span>{formattedDate}</span>
                      </div>
                      {!showSharedAlbums && album.sharedUsers && album.sharedUsers.length > 0 && (
                        <div className="d-flex align-items-center">
                          <BsPeople className="me-1" />
                          <span>Shared</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/album/${album._id}`}
                      state={{ isSharedAlbum: showSharedAlbums }}
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
                <h3 className="card-title mb-3">
                  {showSharedAlbums ? "No Shared Albums" : "No Albums Found"}
                </h3>
                <p className="card-text text-muted mb-4">
                  {showSharedAlbums
                    ? "You don't have any albums shared with you yet. When other users share their albums with you, they will appear here."
                    : "Start organizing your memories by creating your first album. You can add photos, descriptions, and share with friends and family."}
                </p>
                {showSharedAlbums ? (
                  <button 
                    onClick={() => setShowSharedAlbums(false)} 
                    className="btn btn-primary px-4"
                  >
                    Go to My Albums
                  </button>
                ) : (
                  <Link to="/create-album" className="btn btn-primary px-4">
                    Create Your First Album
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Share Album</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeShareModal}
                  disabled={shareStatus === 'loading'}
                ></button>
              </div>
              <div className="modal-body">
                {shareStatus === 'failed' && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <BsExclamationCircle className="me-2" />
                    <div>{shareError || 'Failed to share album'}</div>
                  </div>
                )}
                
                {shareStatus === 'succeeded' && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <BsCheckCircle className="me-2" />
                    <div>Album shared successfully!</div>
                  </div>
                )}
                
                {/* Current sharing status */}
                {albumDetails && albumDetails.album && albumDetails.album.sharedUsers && albumDetails.album.sharedUsers.length > 0 && (
                  <div className="mb-4">
                    <p className="form-label small text-muted fw-semibold">CURRENTLY SHARED WITH</p>
                    <div className="d-flex flex-wrap gap-2">
                      {albumDetails.album.sharedUsers.map((username, index) => (
                        <span key={index} className="badge bg-light text-dark border py-2 px-3">
                          {username}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleShareSubmit}>
                  <div className="mb-3">
                    <label htmlFor="usernames" className="form-label small text-muted fw-semibold">
                      USERNAMES TO SHARE WITH
                    </label>
                    <textarea
                      className={`form-control bg-light ${!shareFormValid ? 'is-invalid' : ''}`}
                      id="usernames"
                      rows="3"
                      placeholder="Enter usernames separated by commas (e.g. john, sarah, mike)"
                      value={usernames}
                      onChange={(e) => setUsernames(e.target.value)}
                      required
                      disabled={shareStatus === 'loading' || shareStatus === 'succeeded'}
                    ></textarea>
                    {!shareFormValid && (
                      <div className="invalid-feedback">
                        Please enter at least one username.
                      </div>
                    )}
                    <div className="form-text">
                      Users will be able to view this album but cannot modify or delete it.
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={closeShareModal}
                      disabled={shareStatus === 'loading'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={shareStatus === 'loading' || shareStatus === 'succeeded'}
                    >
                      {shareStatus === 'loading' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sharing...
                        </>
                      ) : 'Share Album'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for hover effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hover-shadow {
            transition: all 0.3s ease;
          }
          .hover-shadow:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
          }
          .modal {
            transition: opacity 0.15s linear;
          }
          .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.5);
          }
        `
      }} />
    </div>
  );
}