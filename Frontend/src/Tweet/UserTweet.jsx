import React, { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";
import { useNavigate } from "react-router-dom";

const UserMemos = () => {
    const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged-in user details
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const handleCreate = () => {
    navigate("/create-tweet");
  };
  // Fetch only logged-in user's memos
  const fetchUserMemos = async () => {
    try {
      setLoading(true);
      const endpoint = `${import.meta.env.VITE_URL || 'http://localhost:5000'}/api/tweets/user/${currentUser._id}`;
      const response = await axios.get(endpoint);
      setMemos(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching memos:", err);
      setError("Failed to load memos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMemos();
  }, []);

  const handleMemoDeleted = (memoId) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== memoId));
  };

  const handleMemoUpdated = (updatedMemo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo._id === updatedMemo._id ? updatedMemo : memo))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-blue-300 rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
          <p className="text-center text-blue-600 mt-4 font-medium">Loading your memos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchUserMemos}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-memos bg-white rounded-xl p-6 shadow-md border border-gray-100">
      {/* Header with user info */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Memos
              </span>
            </h2>
            <p className="text-gray-500 mt-1">
              Manage and view your personal content on SkillSync
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {memos.length} {memos.length === 1 ? "Memo" : "Memos"}
            </div>
          </div>
        </div>
      </div>

      {/* Create new memo button */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition duration-150 group" onClick={handleCreate}>
          <svg className="w-5 h-5 mr-2 transition-transform duration-150 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Memo
        </button>
      </div>

      {memos.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008A5.972 5.972 0 004 16c0 .552.448 1 1 1h9c.552 0 1-.448 1-1v-1h-3.5c-1.329 0-2.5-.891-2.5-2 0-1.105 1.172-2 2.5-2H15v-1c0-.552-.448-1-1-1H5c-.552 0-1 .448-1 1v7c0 .552.448 1 1 1h14c.552 0 1-.448 1-1V10zm-8-3a1 1 0 100-2 1 1 0 000 2zm-6 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No memos yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Share your thoughts, skills, and experiences with the SkillSync community by creating your first memo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {memos.map((memo) => (
            <div key={memo._id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-lg"></div>
              <Tweet
                tweet={memo}
                currentUser={currentUser}
                onTweetDeleted={handleMemoDeleted}
                onTweetUpdated={handleMemoUpdated}
              />
            </div>
          ))}
        </div>
      )}

      {memos.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing all {memos.length} memos
          </span>
          <button 
            onClick={fetchUserMemos} 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMemos;