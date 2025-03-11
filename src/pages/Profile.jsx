import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonCircle, BsKey, BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { 
  fetchProfile, 
  updateProfile, 
  updatePassword, 
  clearProfileMessage, 
  clearProfileError, 
  clearPasswordMessage, 
  clearPasswordError 
} from '../features/profile/profileSlice';

const ProfilePage = () => {
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { 
    user, 
    status, 
    error, 
    message, 
    passwordStatus, 
    passwordError, 
    passwordMessage 
  } = useSelector((state) => state.profile);
  
  // Local state for form inputs
  const [profileData, setProfileData] = useState({
    name: '',
    profilePicture: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Active tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  
  // Update local state when Redux user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);
  
  // Clear success messages after 3 seconds
  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        dispatch(clearProfileMessage());
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [message, dispatch]);
  
  useEffect(() => {
    let timeoutId;
    if (passwordMessage) {
      timeoutId = setTimeout(() => {
        dispatch(clearPasswordMessage());
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [passwordMessage, dispatch]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearPasswordError());
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // We can't use the Redux state directly for this validation error
      // So we'll dispatch a rejected action manually
      return dispatch({
        type: 'profile/updatePassword/rejected',
        payload: { message: 'New passwords do not match' }
      });
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 6) {
      return dispatch({
        type: 'profile/updatePassword/rejected',
        payload: { message: 'New password must be at least 6 characters long' }
      });
    }
    
    dispatch(updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));
    
    // Reset password form on successful update
    if (!passwordError) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };
  
  if (status === 'loading' && !user) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white p-4 border-0">
              <h2 className="card-title mb-0 fw-bold">Your Profile</h2>
            </div>
            
            <div className="card-body p-4">
              {/* Tab navigation */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <BsPersonCircle className="me-2" />
                    Profile Information
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <BsKey className="me-2" />
                    Change Password
                  </button>
                </li>
              </ul>
              
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <BsExclamationCircle className="me-2" />
                      <div>{error}</div>
                    </div>
                  )}
                  
                  {message && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <BsCheckCircle className="me-2" />
                      <div>{message}</div>
                    </div>
                  )}
                  
                  <form onSubmit={handleProfileUpdate}>
                    {/* Username - Read Only */}
                    <div className="mb-4">
                      <label htmlFor="username" className="form-label text-muted small fw-semibold">USERNAME</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="username"
                        value={user?.username || ''}
                        disabled
                      />
                      <div className="form-text">Username cannot be changed</div>
                    </div>
                    
                    {/* Display Name */}
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label text-muted small fw-semibold">DISPLAY NAME</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    
                    {/* Profile Picture URL */}
                    <div className="mb-4">
                      <label htmlFor="profilePicture" className="form-label text-muted small fw-semibold">PROFILE PICTURE URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="profilePicture"
                        name="profilePicture"
                        value={profileData.profilePicture}
                        onChange={handleProfileChange}
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>
                    
                    {/* Profile Picture Preview */}
                    {profileData.profilePicture && (
                      <div className="mb-4 text-center">
                        <p className="form-label text-muted small fw-semibold">PROFILE PICTURE PREVIEW</p>
                        <img 
                          src={profileData.profilePicture} 
                          alt="Profile" 
                          className="rounded-circle img-thumbnail" 
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="d-grid gap-2 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div>
                  {passwordError && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <BsExclamationCircle className="me-2" />
                      <div>{passwordError}</div>
                    </div>
                  )}
                  
                  {passwordMessage && (
                    <div className="alert alert-success d-flex align-items-center" role="alert">
                      <BsCheckCircle className="me-2" />
                      <div>{passwordMessage}</div>
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordUpdate}>
                    {/* Current Password */}
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="form-label text-muted small fw-semibold">CURRENT PASSWORD</label>
                      <input
                        type="password"
                        className="form-control"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    {/* New Password */}
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="form-label text-muted small fw-semibold">NEW PASSWORD</label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                      />
                      <div className="form-text">Password must be at least 6 characters long</div>
                    </div>
                    
                    {/* Confirm New Password */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label text-muted small fw-semibold">CONFIRM NEW PASSWORD</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <div className="d-grid gap-2 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={passwordStatus === 'loading'}
                      >
                        {passwordStatus === 'loading' ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating Password...
                          </>
                        ) : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;