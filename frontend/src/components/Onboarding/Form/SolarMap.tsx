import React, { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import secureLocalStorage from "react-secure-storage";

interface LatLng {
  lat: number;
  lng: number;
}

interface SolarPanel {
  id: string;
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
  const polygonsRef = useRef<google.maps.Polygon[]>([]);

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
          .map((panel: any, index: number) => {
            const offset = 0.00001;
            return {
              id: `${panel.center.latitude}-${panel.center.longitude}-${index}`, // Ensure unique ID for each panel
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

  useEffect(() => {
    if (map) {
      // Clear existing polygons
      polygonsRef.current.forEach((polygon) => polygon.setMap(null));
      polygonsRef.current = [];

      // Add new polygons
      solarPanels.forEach((panel) => {
        const polygon = new google.maps.Polygon({
          paths: panel.corners,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
        polygon.setMap(map);
        polygon.addListener("click", () => handlePanelClick(panel));
        polygonsRef.current.push(polygon);
      });
    }
  }, [map, solarPanels]);

  const handlePanelClick = (panel: SolarPanel) => {
    setSelectedPanel(panel);
  };

  const handleRemovePanel = (panelId: string) => {
    setSolarPanels((prevPanels) => prevPanels.filter((panel) => panel.id !== panelId));
    if (selectedPanel?.id === panelId) {
      setSelectedPanel(null);
    }
  };

  const mapOptions = {
    tilt: 0,
    heading: 0,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: false,
  };

  return (
    <LoadScript googleMapsApiKey={apiKey!}>
      <div>
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "800px" }}
          center={location}
          zoom={25}
          options={mapOptions}
          onLoad={handleLoad}
        >
          {selectedPanel && (
            <Marker position={selectedPanel.center} label={`Energy: ${selectedPanel.yearlyEnergyDcKwh} kWh`} />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default SolarMap;
