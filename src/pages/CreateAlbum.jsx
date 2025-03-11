import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { postAlbum, updateAlbum } from "../features/album/albumSlice.js";

export default function CreateAlbum() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're editing an existing album by looking for state data
  const existingAlbum = location.state;
  const isEditMode = !!existingAlbum;
  
  const { status, error } = useSelector((state) => state.album);
  
  // This flag helps track if we've submitted the form
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [albumData, setAlbumData] = useState({
    name: '',
    description: '',
    coverUrl: ''
  });
  
  const [validated, setValidated] = useState(false);
  
  // Initialize form with existing album data if in edit mode
  useEffect(() => {
    if (isEditMode && existingAlbum) {
      setAlbumData({
        name: existingAlbum.name || '',
        description: existingAlbum.description || '',
        // Use albumCover or coverUrl depending on your API structure
        coverUrl: existingAlbum.albumCover || existingAlbum.coverUrl || ''
      });
    }
  }, [isEditMode, existingAlbum]);
  
  // Only navigate after successful submission and when we've actually submitted the form
  useEffect(() => {
    if (status === 'succeeded' && formSubmitted) {
      // Add a slight delay to show the success message before redirecting
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate, formSubmitted]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbumData({
      ...albumData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Set formSubmitted to true to enable the navigation after success
    setFormSubmitted(true);
    
    if (isEditMode) {
      // For edit mode, dispatch updateAlbum with the album ID and updated data
      dispatch(updateAlbum({
        id: existingAlbum._id,
        albumData: {
          name: albumData.name,
          description: albumData.description,
          albumCover: albumData.coverUrl // Make sure field names match your API
        }
      }));
    } else {
      // For create mode, dispatch postAlbum with the new album data
      dispatch(postAlbum({
        name: albumData.name,
        description: albumData.description,
        albumCover: albumData.coverUrl // Make sure field names match your API
      }));
    }
  };
  
  // Only show success message if we've actually submitted the form
  const showSuccessMessage = status === 'succeeded' && formSubmitted;
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm border-0">
            <div className="p-4 border-bottom">
              <h3 className="fw-light">
                {isEditMode ? 'Edit Album' : 'Create New Album'}
              </h3>
              <p className="text-muted mb-0">
                {isEditMode 
                  ? 'Update your album information' 
                  : 'Add a new photo collection to your gallery'}
              </p>
            </div>
            
            <div className="p-4">
              {error && formSubmitted && (
                <div className="alert alert-danger bg-danger-subtle text-danger border-0 rounded-3" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
              )}
              
              {showSuccessMessage && (
                <div className="alert alert-success bg-success-subtle text-success border-0 rounded-3" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {isEditMode ? 'Album updated successfully!' : 'Album created successfully!'}
                </div>
              )}
              
              <form className={validated ? 'was-validated' : ''} noValidate onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="albumName" className="form-label small text-muted fw-semibold">ALBUM NAME</label>
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    id="albumName"
                    name="name"
                    value={albumData.name}
                    onChange={handleChange}
                    placeholder="My Amazing Collection"
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide an album name.
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="albumDescription" className="form-label small text-muted fw-semibold">DESCRIPTION</label>
                  <textarea
                    className="form-control border-0 bg-light"
                    id="albumDescription"
                    name="description"
                    value={albumData.description}
                    onChange={handleChange}
                    placeholder="Describe what's special about this collection"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="albumCover" className="form-label small text-muted fw-semibold">COVER IMAGE URL</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <i className="bi bi-link-45deg"></i>
                    </span>
                    <input
                      type="url"
                      className="form-control border-0 bg-light"
                      id="albumCover"
                      name="coverUrl"
                      value={albumData.coverUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-text">This image will be displayed as the album thumbnail</div>
                </div>
                
                <div className="d-grid gap-2 pt-3">
                  <button 
                    className="btn btn-primary btn-lg rounded-3 text-white fw-semibold"
                    type="submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' && formSubmitted ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating Album...' : 'Creating Album...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Album' : 'Create Album'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Back to Albums
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}