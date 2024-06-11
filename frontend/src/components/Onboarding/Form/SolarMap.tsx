"use client";

import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import secureLocalStorage from "react-secure-storage";

const SolarMap = () => {
  const [solarData, setSolarData] = useState<any>(null);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  useEffect(() => {
    const getSolarDataFromLocalStorage = () => {
      const storageItem = secureLocalStorage.getItem("solarData") as string;
      const data = JSON.parse(storageItem);
      setSolarData(data);
      if (data) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      }
    };

    getSolarDataFromLocalStorage();
  }, []);

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 w-full h-full">
      <GoogleMap
        center={mapCenter}
        zoom={25}
        mapContainerStyle={{ height: "100%", width: "100%" }}
        options={{ mapTypeId: google.maps.MapTypeId.SATELLITE }}
      >
        {latitude && longitude && (
          <MarkerF position={mapCenter} />
        )}
      </GoogleMap>
    </div>
  );
};

export default SolarMap;
