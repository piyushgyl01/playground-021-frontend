import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../features/imageFeature/imageSlice';
import { BsChatDots, BsX } from 'react-icons/bs';

const ImageComments = ({ image, albumId, isSharedAlbum }) => {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleComments = () => {
    setShowComments(!showComments);
    setCommentText('');
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    dispatch(addComment({ 
      albumId, 
      imageId: image._id, 
      text: commentText 
    }))
      .unwrap()
      .then(() => {
        setCommentText('');
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Failed to add comment:', error);
        setIsSubmitting(false);
      });
  };
  
  // If there are no comments and comments are not shown, render just the button
  if (!showComments && (!image.comments || image.comments.length === 0)) {
    return (
      <div className="mt-2">
        <button
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={toggleComments}
        >
          <BsChatDots className="me-2" /> Add Comment
        </button>
      </div>
    );
  }
  
  return (
    <div className="mt-3">
      {/* Comments Header with Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-bold">
          <BsChatDots className="me-2" /> 
          Comments {image.comments && image.comments.length > 0 && `(${image.comments.length})`}
        </h6>
        <button 
          className="btn btn-sm btn-link text-muted p-0" 
          onClick={toggleComments}
        >
          {showComments ? <BsX size={20} /> : 'Show'}
        </button>
      </div>
      
      {/* Comments List */}
      {showComments && (
        <>
          {image.comments && image.comments.length > 0 ? (
            <div className="comment-list mb-3 border-bottom pb-2">
              {image.comments.map((comment, index) => (
                <div key={index} className="comment mb-2 pb-2 border-bottom">
                  <div className="d-flex justify-content-between">
                    <strong className="text-primary">
                      {comment.user?.name || comment.user?.username || 'User'}
                    </strong>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-0 text-break">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted small mb-3">No comments yet. Be the first to comment!</p>
          )}
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                className="btn btn-primary btn-sm" 
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ImageComments;