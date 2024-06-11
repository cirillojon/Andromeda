"use client";

import { useEffect, useState } from "react";

const SolarMap = () => {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    const getSolarDataFromLocalStorage = () => {
      const loadedData = localStorage.getItem("solarData");
      if (loadedData) {
        setSolarData(JSON.parse(loadedData));
      }
    };

    getSolarDataFromLocalStorage();
  }, []);

  useEffect(() => {
    if (solarData) {
      console.log("FROM LOCAL STORAGE: ", solarData);
    }
  }, [solarData]);

  return (
    <div className="flex-1 w-full h-full">
      <h1 className="text-4xl items-end">Solar Map</h1>
    </div>
  );
};

export default SolarMap;
