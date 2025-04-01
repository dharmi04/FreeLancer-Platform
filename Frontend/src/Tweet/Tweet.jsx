import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Tweet = ({ tweet, currentUser, onTweetDeleted, onTweetUpdated }) => {
  const [isLiked, setIsLiked] = useState(
    tweet.likes && tweet.likes.includes(currentUser?._id)
  );
  const [likesCount, setLikesCount] = useState(tweet.likes ? tweet.likes.length : 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  
  const token = localStorage.getItem("token");
  
  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/tweets/${tweet._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Toggle like state
      setIsLiked(!isLiked);
      setLikesCount(response.data.length);
    } catch (err) {
      console.error("Error liking tweet:", err);
    }
  };
  
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await axios.post(
        `http://localhost:5000/api/tweets/${tweet._id}/comment`,
        { content: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh tweet to show new comment
      const updatedTweet = await axios.get(`http://localhost:5000/api/tweets/${tweet._id}`);
      onTweetUpdated(updatedTweet.data);
      
      setCommentText("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        await axios.delete(`http://localhost:5000/api/tweets/${tweet._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        onTweetDeleted(tweet._id);
      } catch (err) {
        console.error("Error deleting tweet:", err);
      }
    }
  };
  
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tweets/${tweet._id}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onTweetUpdated(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating tweet:", err);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Tweet Header */}
      <div className="flex items-center mb-3">
        <Link to={`/profile/${tweet.userId._id}`} className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            {tweet.userId.profilePicture ? (
              <img 
                src={`http://localhost:5000/${tweet.userId.profilePicture}`} 
                alt={`${tweet.userId.name}'s profile`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{tweet.userId.name}</h3>
            <p className="text-xs text-gray-500">{formatDate(tweet.createdAt)}</p>
          </div>
        </Link>
        
        {/* Edit/Delete dropdown for tweet owner */}
        {currentUser && currentUser._id === tweet.userId._id && (
          <div className="ml-auto relative">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <button 
                onClick={() => setIsEditing(true)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Tweet Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            maxLength="280"
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-2"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-3 whitespace-pre-line">{tweet.content}</p>
      )}
      
      {/* Tweet Media (if any) */}
      {tweet.media && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img 
            src={`http://localhost:5000/${tweet.media}`} 
            alt="Tweet media" 
            className="w-full object-cover"
          />
        </div>
      )}
      
      {/* Tweet Tags */}
      {tweet.tags && tweet.tags.length > 0 && (
        <div className="flex flex-wrap mb-3">
          {tweet.tags.map((tag, index) => (
            <span key={index} className="text-blue-600 text-sm mr-2">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Tweet Actions */}
      <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
        <button 
          onClick={handleLike}
          className={`flex items-center ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>{tweet.comments ? tweet.comments.length : 0}</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {/* Comment Form */}
          {currentUser && (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="280"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
                  disabled={!commentText.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          )}
          
          {/* Comments List */}
          <div className="space-y-3">
            {tweet.comments && tweet.comments.map((comment, index) => (
              <div key={index} className="flex p-3 bg-gray-50 rounded-md">
                <Link to={`/profile/${comment.userId._id}`} className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    {comment.userId.profilePicture ? (
                      <img 
                        src={`http://localhost:5000/${comment.userId.profilePicture}`} 
                        alt={`${comment.userId.name}'s profile`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Link to={`/profile/${comment.userId._id}`} className="font-medium text-gray-800 text-sm">
                      {comment.userId.name}
                    </Link>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweet;