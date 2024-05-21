"use client";

import { useEffect, useState } from 'react';
import React from 'react';

const MessageComponent = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data from /api/hello");
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setMessage(data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Example of adding resp into ui
  // return <div>{!loading ? message : "Loading.."}</div>;

  // Currently dont display anything
  return (
    <div>
      {/* Flask API Testing */}
    </div>
  );
};

export default MessageComponent;
