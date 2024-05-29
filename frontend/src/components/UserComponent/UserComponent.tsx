"use client";

import { useEffect, useState } from 'react';
import React from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  sso_token: string;
}

const UserComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data from /api/user/1");
    fetch('/api/user/1')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Flask API Testing - User */}
    </div>
  );
};

export default UserComponent;
