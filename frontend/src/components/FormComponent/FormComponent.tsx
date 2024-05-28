"use client";

import { useEffect, useState } from 'react';
import React from 'react';

interface Form {
  id: number;
  user_id: number;
  status: string;
  last_modified: string;
  created_at: string;
}

const FormComponent: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data from /api/form/1");
    fetch('/api/form/1')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setForm(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Flask API Testing - Form */}
    </div>
  );
};

export default FormComponent;
