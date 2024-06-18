"use client";
import Image from "next/image";
import React, { useState } from 'react';
import { Input } from "../../ui/input";

const WaitlistPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    contactPhone: '',
    location: '',
    serviceInterest: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const checkFormValidity = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsFormValid(emailRegex.test(formData.email));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    checkFormValidity();
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful response
        console.log('Waitlist entry created successfully');
      } else {
        // Handle error response
        console.log('Failed to create waitlist entry');
      }
    } catch (error) {
      console.error('An error occurred while creating the waitlist entry:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl mt-16">
      <div className="flex flex-col mt-0 mb-14 md:mb-0">
        <h1 className="scaling-header-text md:mb-10">
          Join Our Waitlist
        </h1>
        <div className="flex flex-col m-auto mb-2 mt-8">
          <span className="scaling-text">Email</span>
          <Input
            id="email"
            placeholder="Email Address"
            type="email"
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col m-auto mb-2">
          <span className="scaling-text">Name</span>
          <Input
            id="name"
            placeholder="Name"
            type="text"
            name="name"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col m-auto mb-2">
          <span className="scaling-text">Contact Phone</span>
          <Input
            id="contactPhone"
            placeholder="Contact Phone"
            type="text"
            name="contactPhone"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col m-auto mb-2">
          <span className="scaling-text">Location</span>
          <Input
            id="location"
            placeholder="Location"
            type="text"
            name="location"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col m-auto mb-2">
          <span className="scaling-text">Service Interest</span>
          <Input
            id="serviceInterest"
            placeholder="Service Interest"
            type="text"
            name="serviceInterest"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex m-auto md:mb-10">
          <button
            disabled={!isFormValid}
            className="ml-2 py-2 px-4 rounded text-white bg-indigo-400 hover:bg-indigo-600"
            onClick={handleSubmit}
          >
            Subscribe
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="scaling-text w-2/3 mt-8">
            Romeo is initially launching in the Tampa and Orlando areas. Enter your email above to be alerted when we go live!
          </span>
          <span className="scaling-text w-2/3 mt-4">
            The first 100 homeowners to sign-up will receive a promotional offer upon launch.
          </span>
        </div>
      </div>
      <div className="flex md:w-full md:h-full flex-col items-end w-0 h-0">
        <Image
          src="/assets/hero/florida_better.jpg"
          alt="Florida Map"
          width={500}
          height={200}
        />
      </div>
    </div>
  );
};

export default WaitlistPage;