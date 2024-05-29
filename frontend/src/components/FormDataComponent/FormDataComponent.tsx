"use client";

import { useEffect, useState } from 'react';
import React from 'react';

interface FormData {
  id: number;
  field_name: string;
  field_value: string;
  created_by: number;
  last_modified: string;
  created_at: string;
}

const FormDataComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching data from /api/form_data/1");
    fetch('/api/form_data/1')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setFormData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Flask API Testing - Form Data */}
    </div>
  );
};

export default FormDataComponent;
