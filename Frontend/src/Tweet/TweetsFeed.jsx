import React, { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";
import CreateTweet from "./CreateTweet";

const TweetsFeed = ({ userId = null }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem("user"));
  
  const fetchTweets = async () => {
    try {
      setLoading(true);
      let endpoint = "http://localhost:5000/api/tweets";
      
      // If userId is provided, fetch only that user's tweets
      if (userId) {
        endpoint = `http://localhost:5000/api/tweets/user/${userId}`;
      }
      
      const response = await axios.get(`${endpoint}?page=${page}&limit=10`);
      
      if (page === 1) {
        setTweets(response.data.tweets);
      } else {
        setTweets(prevTweets => [...prevTweets, ...response.data.tweets]);
      }
      
      setHasMore(page < response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError("Failed to load tweets");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTweets();
  }, [page, userId]);
  
  const handleTweetCreated = (newTweet) => {
    setTweets(prevTweets => [newTweet, ...prevTweets]);
  };
  
  const handleTweetDeleted = (deletedTweetId) => {
    setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== deletedTweetId));
  };
  
  const handleTweetUpdated = (updatedTweet) => {
    setTweets(prevTweets => 
      prevTweets.map(tweet => 
        tweet._id === updatedTweet._id ? updatedTweet : tweet
      )
    );
  };
  
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setPage(1);
            fetchTweets();
          }}
          className="mt-2 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Only show CreateTweet if not viewing a specific user's tweets 
          or if viewing the current user's tweets */}
      {(!userId || (currentUser && userId === currentUser._id)) && (
        <CreateTweet onTweetCreated={handleTweetCreated} />
      )}
      
      {tweets.length === 0 && !loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No tweets yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map(tweet => (
            <Tweet
              key={tweet._id}
              tweet={tweet}
              currentUser={currentUser}
              onTweetDeleted={handleTweetDeleted}
              onTweetUpdated={handleTweetUpdated}
            />
          ))}
          
          {loading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {hasMore && !loading && (
            <div className="text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetsFeed;