"use client";

import React, { useEffect, useState, useMemo } from "react";
import { GoogleMap, Polygon, Marker, LoadScript } from "@react-google-maps/api";
import secureLocalStorage from "react-secure-storage";

interface LatLng {
  lat: number;
  lng: number;
}

interface SolarPanel {
  center: LatLng;
  orientation: "LANDSCAPE" | "PORTRAIT";
  yearlyEnergyDcKwh: number;
  corners: LatLng[];
}

interface SolarMapProps {
  panelCount: number;
}

const SolarMap: React.FC<SolarMapProps> = ({ panelCount }) => {
  const [solarPanels, setSolarPanels] = useState<SolarPanel[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<LatLng>({ lat: 0, lng: 0 });
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    const getSolarDataFromLocalStorage = () => {
      const storageItem = secureLocalStorage.getItem("solarData") as string;
      const data = JSON.parse(storageItem);
      if (data) {
        setLocation({ lat: data.latitude, lng: data.longitude });
        const solarPotential = data.building_insights.solarPotential;
        const newPanels: SolarPanel[] = solarPotential.solarPanels
          .slice(0, panelCount)
          .map((panel: any) => {
            const offset = 0.00001;
            return {
              center: { lat: panel.center.latitude, lng: panel.center.longitude },
              orientation: panel.orientation,
              yearlyEnergyDcKwh: panel.yearlyEnergyDcKwh,
              corners: [
                { lat: panel.center.latitude + offset, lng: panel.center.longitude + offset },
                { lat: panel.center.latitude + offset, lng: panel.center.longitude - offset },
                { lat: panel.center.latitude - offset, lng: panel.center.longitude - offset },
                { lat: panel.center.latitude - offset, lng: panel.center.longitude + offset },
              ],
            };
          });
        setSolarPanels(newPanels);
      }
    };

    getSolarDataFromLocalStorage();
  }, [panelCount]);

  const handlePanelClick = (panel: SolarPanel) => {
    setSelectedPanel(panel);
  };

  const renderPanels = () => {
    return solarPanels.map((panel, index) => (
      <Polygon
        key={index}
        path={panel.corners}
        options={{
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
        onClick={() => handlePanelClick(panel)}
      />
    ));
  };

  return (
    <LoadScript googleMapsApiKey={apiKey!}>
      <div>
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "800px" }}
          center={location}
          zoom={25}
          mapTypeId="satellite"
          onLoad={handleLoad}
        >
          {renderPanels()}
          {selectedPanel && (
            <Marker position={selectedPanel.center} label={`Energy: ${selectedPanel.yearlyEnergyDcKwh} kWh`} />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default SolarMap;
