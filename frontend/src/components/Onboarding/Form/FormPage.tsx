"use client"

import React, { useState } from 'react';
import "./FormPage.css";

const FormPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Solar');

  const renderContent = () => {
    switch (activeTab) {
      case 'Solar':
        return (
          <div className="content">
            <h1 className="scaling-header-text">Solar Data Input</h1>
            <input type="text" placeholder="Input 1" className="input" />
            <input type="text" placeholder="Input 2" className="input" />
            <input type="text" placeholder="Input 3" className="input" />
          </div>
        );
      case 'Roofing':
        return (
          <div className="content">
            <h1 className="scaling-header-text">Roofing Data Input</h1>
            <input type="text" placeholder="Input 1" className="input" />
            <input type="text" placeholder="Input 2" className="input" />
            <input type="text" placeholder="Input 3" className="input" />
          </div>
        );
      case 'Battery':
        return (
          <div className="content">
            <h1 className="scaling-header-text">Battery Data Input</h1>
            <input type="text" placeholder="Input 1" className="input" />
            <input type="text" placeholder="Input 2" className="input" />
            <input type="text" placeholder="Input 3" className="input" />
          </div>
        );
        case 'HVAC':
          return (
            <div className="content">
              <h1 className="scaling-header-text">Coming Soon!</h1>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="container md:mt-16 mt-0">
      <div className="tabs">
        <button className={`tab scaling-header-text ${activeTab === 'Solar' ? "active" : ''}`} onClick={() => setActiveTab('Solar')}>Solar</button>
        <button className={`tab scaling-header-text ${activeTab === 'Roofing' ? "active" : ''}`} onClick={() => setActiveTab('Roofing')}>Roofing</button>
        <button className={`tab scaling-header-text ${activeTab === 'Battery' ? "active" : ''}`} onClick={() => setActiveTab('Battery')}>Battery</button>
        <button className={`tab scaling-header-text ${activeTab === 'HVAC' ? "active" : ''}`} onClick={() => setActiveTab('HVAC')}>HVAC</button>
      </div>
      <div className="mainContent">
        <div className="viewbox">
          {/* Placeholder for the large viewbox */}
        </div>
        <div className="sidebar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
