"use client";

import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const SolarMap = () => {
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    const getSolarDataFromLocalStorage = () => {
      const storageItem = secureLocalStorage.getItem("solarData") as string;
      setSolarData(JSON.parse(storageItem));
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
