"use client"

import React, { useState } from 'react';
import "./FormPage.css";
import SolarMap from './SolarMap';

const FormPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Solar');
  const [panelCount, setPanelCount] = useState<number>(10); // Default to showing 10 panels

  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanelCount(Number(e.target.value));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Solar':
        return (
          <div className="content">
            <h1 className="scaling-header-text">Solar Data Input</h1>
            <input
              type="number"
              placeholder="Number of Panels"
              className="input"
              value={panelCount}
              onChange={handlePanelCountChange}
              min="1"
              step="1"
            />
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
    <div className="form-container md:mt-16 mt-0">
      <div className="tabs">
        <button className={`tab scaling-header-text ${activeTab === 'Solar' ? "active" : ''}`} onClick={() => setActiveTab('Solar')}>Solar</button>
        <button className={`tab scaling-header-text ${activeTab === 'Roofing' ? "active" : ''}`} onClick={() => setActiveTab('Roofing')}>Roofing</button>
        <button className={`tab scaling-header-text ${activeTab === 'Battery' ? "active" : ''}`} onClick={() => setActiveTab('Battery')}>Battery</button>
        <button className={`tab scaling-header-text ${activeTab === 'HVAC' ? "active" : ''}`} onClick={() => setActiveTab('HVAC')}>HVAC</button>
      </div>
      <div className="mainContent">
        <div className="viewbox">
          <SolarMap panelCount={panelCount} />
        </div>
        <div className="sidebar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
