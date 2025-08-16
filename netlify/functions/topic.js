// netlify/functions/topic.js

// In-memory storage (resets when function cold starts)
let currentTopic = { activeTopic: null, timestamp: Date.now() };

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Handle POST - Update topic
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      currentTopic = {
        activeTopic: data.activeTopic,
        timestamp: data.timestamp || Date.now(),
      };

      console.log(
        "Topic updated:",
        currentTopic.activeTopic?.text || "No topic"
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: "ok", topic: currentTopic }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }
  }

  // Handle GET - Retrieve current topic
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(currentTopic),
    };
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
