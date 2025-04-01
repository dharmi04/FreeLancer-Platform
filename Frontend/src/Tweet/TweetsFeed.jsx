import React, { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";
//import CreateTweet from "./CreateTweet";

const TweetsFeed = ({ userId = null }) => {
  const [memos, setMemos] = useState([]);
  const [tweeta, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  

  const fetchMemos = async () => {
    try {
      setLoading(true);
      let endpoint = 'http://localhost:5000/api/tweets'; // Using environment variable consistently

      // If userId is provided, fetch only that user's memos
      if (userId) {
        endpoint = `${import.meta.env.VITE_URL}/tweets/user/${userId}`;
      }

      const response = await axios.get(endpoint);

      // Filter out the logged-in user's memos
      const filteredMemos = response.data.filter(memo => memo.userId._id !== currentUser._id);
      setMemos(filteredMemos);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching memos:", err);
      setError("Failed to load memos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, [userId]);

  
  const handleLike = async (tweetId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tweets/like/${tweetId}`, {}, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const updatedTweet = response.data.tweet;
      
      setMemos((prevMemos) =>
        prevMemos.map((memo) => (memo._id === updatedTweet._id ? updatedTweet : memo))
      );
    } catch (error) {
      console.error("Error liking tweet:", error);
    }
  };

  

  
  const fetchUserTweets = async () => {
    try {
      setLoading(true);
      const endpoint = `http://localhost:5000/api/tweets/user/${currentUser._id}`;
      const response = await axios.get(endpoint);
      setTweets(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError("Failed to load tweets");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTweets();
  }, []);
  const handleMemoCreated = (newMemo) => {
    setMemos((prevMemos) => [newMemo, ...prevMemos]);
  };

  const handleMemoDeleted = (deletedMemoId) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== deletedMemoId));
  };

  const handleMemoUpdated = (updatedMemo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) => (memo._id === updatedMemo._id ? updatedMemo : memo))
    );
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          <p className="text-center text-blue-600 mt-4 font-medium">Loading memos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md my-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchMemos();
              }}
              className="mt-3 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
    <div className="memo-feed bg-gray-50 rounded-xl p-6 shadow-sm">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {userId && userId !== currentUser?._id ? "User Memos" : "Community Memos"}
            </h2>
            <p className="text-gray-500 mt-1">
              {!userId ? "Explore what others are sharing on SkillSync" : "View this user's shared content"}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            <a href={`/user-tweet/${currentUser.name}`} className="text-1xl font-bold text-blue-700">
 Your Profile
</a>

            </span>
          </div>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
      </div>

      {memos.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008A5.972 5.972 0 004 16c0 .552.448 1 1 1h9c.552 0 1-.448 1-1v-1h-3.5c-1.329 0-2.5-.891-2.5-2 0-1.105 1.172-2 2.5-2H15v-1c0-.552-.448-1-1-1H5c-.552 0-1 .448-1 1v7c0 .552.448 1 1 1h14c.552 0 1-.448 1-1V10zm-8-3a1 1 0 100-2 1 1 0 000 2zm-6 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No memos available yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Be the first to share your insights and thoughts with the SkillSync community.</p>
          <button className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow hover:shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Create your first memo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {memos.map((memo) => (
            <div key={memo._id} className="transform transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-1"> {/* Add a subtle border highlight */}
                  <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <Tweet
                  tweet={memo}
                  currentUser={currentUser}
                  onTweetDeleted={handleMemoDeleted}
                  onTweetUpdated={handleMemoUpdated}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {memos.length > 5 && (
        <div className="mt-8 flex justify-center">
          <button className="px-5 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-lg shadow hover:bg-blue-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Load more memos
          </button>
        </div>
      )}
    </div>
  );
};

export default TweetsFeed;
