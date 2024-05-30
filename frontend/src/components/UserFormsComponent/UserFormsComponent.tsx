"use client";

import { useEffect, useState } from 'react';
import React from 'react';

interface Form {
  id: number;
  status: string;
  last_modified: string;
  created_at: string;
  sso_token: string;
}

const UserFormsComponent: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data from /api/forms/user/1");
    fetch('/api/forms/user/1')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setForms(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Flask API Testing - User Forms */}
    </div>
  );
};

export default UserFormsComponent;
