import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { postImage } from '../features/imageFeature/imageSlice';
import { BsUpload, BsImage, BsX } from 'react-icons/bs';

export default function AddImage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { albumId } = useParams();
  const fileInputRef = useRef(null);
  
  const { status, error } = useSelector((state) => state.image);
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [imageData, setImageData] = useState({
    name: '',
    tags: '',
    person: '',
    isFavorite: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [validated, setValidated] = useState(false);
  
  // Navigate back to album detail after successful upload
  const handleSuccess = () => {
    if (status === 'succeeded' && formSubmitted) {
      const timer = setTimeout(() => {
        navigate(`/album/${albumId}`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setImageData({
      ...imageData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false || !selectedFile) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setFormSubmitted(true);
    
    // Create form data with file and metadata
    const formData = {
      file: selectedFile,
      name: imageData.name,
      tags: imageData.tags,
      person: imageData.person,
      isFavorite: imageData.isFavorite
    };
    
    dispatch(postImage({ albumId, imageData: formData }))
      .unwrap()
      .then(() => {
        handleSuccess();
      })
      .catch((error) => {
        console.error('Failed to upload image:', error);
        setFormSubmitted(false);
      });
  };
  
  // Show success message if we've submitted the form and upload succeeded
  const showSuccessMessage = status === 'succeeded' && formSubmitted;
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="bg-white rounded-3 shadow-sm border-0">
            <div className="p-4 border-bottom">
              <h3 className="fw-light">Add Image</h3>
              <p className="text-muted mb-0">
                Upload a new photo to your album
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
                  Image uploaded successfully!
                </div>
              )}
              
              <form className={validated ? 'was-validated' : ''} noValidate onSubmit={handleSubmit}>
                {/* File Upload Section */}
                <div className="mb-4">
                  <label className="form-label small text-muted fw-semibold">IMAGE FILE</label>
                  
                  {!previewUrl ? (
                    <div 
                      className="border border-dashed rounded-3 p-5 text-center bg-light position-relative"
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: 'pointer' }}
                    >
                      <BsImage size={48} className="text-muted mb-3" />
                      <p className="mb-1">Click to select an image</p>
                      <p className="text-muted small mb-0">JPEG, PNG, GIF up to 5MB</p>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="d-none"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/gif"
                        required
                      />
                    </div>
                  ) : (
                    <div className="position-relative mb-3">
                      <img 
                        src={previewUrl}
                        alt="Preview" 
                        className="img-thumbnail"
                        style={{ maxHeight: '200px', width: 'auto', display: 'block', margin: '0 auto' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                        onClick={handleRemoveFile}
                        style={{ margin: '5px' }}
                      >
                        <BsX />
                      </button>
                    </div>
                  )}
                  
                  {validated && !selectedFile && (
                    <div className="invalid-feedback d-block">
                      Please select an image file.
                    </div>
                  )}
                </div>
                
                {/* Image Name */}
                <div className="mb-4">
                  <label htmlFor="imageName" className="form-label small text-muted fw-semibold">IMAGE NAME</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    id="imageName"
                    name="name"
                    value={imageData.name}
                    onChange={handleChange}
                    placeholder="Give your image a descriptive name"
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide an image name.
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mb-4">
                  <label htmlFor="tags" className="form-label small text-muted fw-semibold">TAGS</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    id="tags"
                    name="tags"
                    value={imageData.tags}
                    onChange={handleChange}
                    placeholder="vacation, summer, beach (comma separated)"
                  />
                  <div className="form-text">
                    Add tags to make your images easier to find later
                  </div>
                </div>
                
                {/* Person Tag */}
                <div className="mb-4">
                  <label htmlFor="person" className="form-label small text-muted fw-semibold">PERSON</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    id="person"
                    name="person"
                    value={imageData.person}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  <div className="form-text">
                    Tag a person in this photo (optional)
                  </div>
                </div>
                
                {/* Favorite Checkbox */}
                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isFavorite"
                    name="isFavorite"
                    checked={imageData.isFavorite}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isFavorite">
                    Mark as favorite
                  </label>
                </div>
                
                {/* Submit Button */}
                <div className="d-grid gap-2 pt-3">
                  <button 
                    className="btn btn-primary btn-lg rounded-3 text-white fw-semibold"
                    type="submit"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' && formSubmitted ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Uploading Image...
                      </>
                    ) : (
                      <>
                        <BsUpload className="me-2" /> Upload Image
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to={`/album/${albumId}`} className="text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Back to Album
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}