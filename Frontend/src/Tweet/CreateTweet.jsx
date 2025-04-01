import React, { useState } from "react";
import axios from "axios";

const CreateTweet = ({ onTweetCreated }) => {
  const [tweetContent, setTweetContent] = useState(""); // Use tweetContent consistently
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Retrieve once

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tweetContent.trim()) {
      setError("Tweet content is required.");
      return;
    }

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/tweets",
        { content: tweetContent, tags: tags.split(",").map(tag => tag.trim()) }, // Send tags as an array
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Tweet created:", response.data);
      setTweetContent(""); // Clear input after success
      setTags("");
      onTweetCreated?.(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating tweet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Create Tweet</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-3">
          <textarea
            placeholder="What's happening?"
            value={tweetContent} // Use tweetContent here
            onChange={(e) => setTweetContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            maxLength="280"
            disabled={isLoading}
          />
          <div className="text-right text-xs text-gray-500">
            {tweetContent.length}/280
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading || !tweetContent.trim()} // Ensure correct disabling
          >
            {isLoading ? "Posting..." : "Tweet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTweet;
