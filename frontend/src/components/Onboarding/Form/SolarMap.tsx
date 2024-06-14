import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import secureLocalStorage from "react-secure-storage";

interface LatLng {
  lat: number;
  lng: number;
}

export interface RoofSegment {
  id: string;
  center: LatLng;
  areaMeters2: number;
  pitchDegrees: number;
  azimuthDegrees: number;
  corners: LatLng[];
  stats: {
    areaMeters2: number;
    groundAreaMeters2: number;
    sunshineQuantiles: number[];
  };
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
  selectedSegment: RoofSegment | null;
  showHeatmap: boolean;
}

const SolarMap: React.FC<SolarMapProps> = ({
  panelCount,
  selectedSegment,
  showHeatmap,
}) => {
  const [solarPanels, setSolarPanels] = useState<SolarPanel[]>([]);
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState<LatLng>({ lat: 0, lng: 0 });
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null
  );

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
            const offsetLat = 0.000005; // height
            const offsetLng = 0.000005; // width
            return {
              id: `${panel.center.latitude}-${panel.center.longitude}-${index}`, // Ensure unique ID for each panel
              center: {
                lat: panel.center.latitude,
                lng: panel.center.longitude,
              },
              orientation: panel.orientation,
              yearlyEnergyDcKwh: panel.yearlyEnergyDcKwh,
              corners: [
                {
                  lat: panel.center.latitude + offsetLat,
                  lng: panel.center.longitude + offsetLng,
                },
                {
                  lat: panel.center.latitude + offsetLat,
                  lng: panel.center.longitude - offsetLng,
                },
                {
                  lat: panel.center.latitude - offsetLat,
                  lng: panel.center.longitude - offsetLng,
                },
                {
                  lat: panel.center.latitude - offsetLat,
                  lng: panel.center.longitude + offsetLng,
                },
              ],
            };
          });

        const newSegments: RoofSegment[] = solarPotential.roofSegmentStats.map(
          (segment: any, index: number) => {
            const offsetLat = 0.00001; // height
            const offsetLng = 0.00001; // width
            return {
              id: `${segment.center.latitude}-${segment.center.longitude}-${index}`, // Ensure unique ID for each segment
              center: {
                lat: segment.center.latitude,
                lng: segment.center.longitude,
              },
              areaMeters2: segment.stats.areaMeters2,
              pitchDegrees: segment.pitchDegrees,
              azimuthDegrees: segment.azimuthDegrees,
              corners: [
                {
                  lat: segment.boundingBox.ne.latitude,
                  lng: segment.boundingBox.ne.longitude,
                },
                {
                  lat: segment.boundingBox.ne.latitude,
                  lng: segment.boundingBox.sw.longitude,
                },
                {
                  lat: segment.boundingBox.sw.latitude,
                  lng: segment.boundingBox.sw.longitude,
                },
                {
                  lat: segment.boundingBox.sw.latitude,
                  lng: segment.boundingBox.ne.longitude,
                },
              ],
              stats: segment.stats,
            };
          }
        );

        setSolarPanels(newPanels);
        setRoofSegments(newSegments);
      }
    };

    getSolarDataFromLocalStorage();
  }, [panelCount]);

  useEffect(() => {
    if (map) {
      // Clear existing polygons
      polygonsRef.current.forEach((polygon) => polygon.setMap(null));
      polygonsRef.current = [];

      // Add new panels if heatmap is not shown
      if (!showHeatmap) {
        solarPanels.forEach((panel) => {
          const polygon = new google.maps.Polygon({
            paths: panel.corners,
            fillColor: "#1E90FF",
            fillOpacity: 0.5,
            strokeColor: "#D3D3D3",
            strokeOpacity: 0.7,
            strokeWeight: 2,
            zIndex: 1, // Ensure the panels appear above other map elements
          });
          polygon.setMap(map);
          polygon.addListener("click", () => handlePanelClick(panel));
          polygonsRef.current.push(polygon);
        });

        // Add the selected roof segment
        if (selectedSegment) {
          const polygon = new google.maps.Polygon({
            paths: selectedSegment.corners,
            fillColor: "#FF6347",
            fillOpacity: 0.5,
            strokeColor: "#D3D3D3",
            strokeOpacity: 0.7,
            strokeWeight: 2,
            zIndex: 1, // Ensure the segment appears above other map elements
          });
          polygon.setMap(map);
          polygonsRef.current.push(polygon);
        }
      }

      // Add or remove heatmap layer
      if (showHeatmap) {
        if (heatmapRef.current) {
          heatmapRef.current.setMap(null);
        }

        const generateHeatmapPoints = (
          corners: LatLng[],
          quantiles: number[]
        ) => {
          const heatmapPoints = [];
          const [topLeft, topRight, bottomRight, bottomLeft] = corners;
          const latStep = (bottomLeft.lat - topLeft.lat) / 20;
          const lngStep = (topRight.lng - topLeft.lng) / 20;

          for (let i = 0; i <= 20; i++) {
            for (let j = 0; j <= 20; j++) {
              const lat = topLeft.lat + i * latStep;
              const lng = topLeft.lng + j * lngStep;
              const weightIndex = Math.floor(
                ((i * 20 + j) / (20 * 20)) * quantiles.length
              );
              heatmapPoints.push({
                location: new google.maps.LatLng(lat, lng),
                weight: quantiles[weightIndex] || 0, // Ensure it does not go out of bounds
              });
            }
          }

          return heatmapPoints;
        };

        const heatmapData = roofSegments.flatMap((segment) =>
          generateHeatmapPoints(
            segment.corners,
            segment.stats.sunshineQuantiles
          )
        );

        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          dissipating: true,
          radius: 8,
          opacity: 0.8,
          gradient: [
            "rgba(0, 255, 255, 0)",
            "rgba(0, 255, 255, 1)",
            "rgba(0, 191, 255, 1)",
            "rgba(0, 127, 255, 1)",
            "rgba(0, 63, 255, 1)",
            "rgba(0, 0, 255, 1)",
            "rgba(0, 0, 223, 1)",
            "rgba(0, 0, 191, 1)",
            "rgba(0, 0, 159, 1)",
            "rgba(0, 0, 127, 1)",
            "rgba(63, 0, 91, 1)",
            "rgba(127, 0, 63, 1)",
            "rgba(191, 0, 31, 1)",
            "rgba(255, 0, 0, 1)",
          ],
        });

        heatmapRef.current.setMap(map);
      } else if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
    }
  }, [map, solarPanels, roofSegments, selectedSegment, showHeatmap]);

  const handlePanelClick = (panel: SolarPanel) => {
    setSelectedPanel(panel);
  };

  const handleRemovePanel = (panelId: string) => {
    setSolarPanels((prevPanels) =>
      prevPanels.filter((panel) => panel.id !== panelId)
    );
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
    <LoadScript googleMapsApiKey={apiKey!} libraries={["visualization"]}>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={location}
          zoom={25}
          options={mapOptions}
          onLoad={handleLoad}
        >
          {selectedPanel && (
            <Marker
              position={selectedPanel.center}
              label={`Energy: ${selectedPanel.yearlyEnergyDcKwh} kWh`}
            />
          )}
          {selectedSegment && (
            <Marker
              position={selectedSegment.center}
              label={`Area: ${selectedSegment.areaMeters2} m²`}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default SolarMap;
