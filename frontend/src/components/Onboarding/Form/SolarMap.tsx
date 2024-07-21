import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Libraries,
} from "@react-google-maps/api";
import secureLocalStorage from "react-secure-storage";
import {
  createPalette,
  normalize,
  rgbToColor,
} from "./SubFormComponents/Visualize";
import { DataLayersResponse, SolarData } from "./SolarTypes";
import { Layer, getHeatmap } from "@/utils/actions/getHeatmap";
import { toast } from "sonner";
import getDataLayers from "@/utils/actions/getDataLayers";

const libraries: Libraries = ["places", "geometry", "visualization"];

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
  azimuth: number;
  minEnergy: number;
  maxEnergy: number;
  width: number;
  height: number;
}

interface SolarMapProps {
  panelCount: number;
  selectedSegment: RoofSegment | null;
  showHeatmap: boolean;
  showAllSegments: boolean;
  address: string;
}

const SolarMap: React.FC<SolarMapProps> = ({
  panelCount,
  selectedSegment,
  showHeatmap,
  showAllSegments,
  address,
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
  const dataLayersRef = useRef<DataLayersResponse | undefined>();
  const overlaysRef = useRef<google.maps.GroundOverlay[]>([]);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [triggeredDataLayers, setTriggeredDataLayers] = useState(true);
  const [getNewHeatmap, setGetNewHeatmap] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    const getSolarDataFromLocalStorage = async () => {
      const storageItem = secureLocalStorage.getItem("solarData") as string;
      const data = JSON.parse(storageItem) as SolarData;
      if (data) {
        setLocation({ lat: data.latitude, lng: data.longitude });
        setSolarData(data);
        const newSegments: RoofSegment[] =
          data.building_insights.solarPotential.roofSegmentStats.map(
            (segment: any, index: number) => {
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
                    lat: segment.boundingBox.sw.latitude,
                    lng: segment.boundingBox.ne.longitude,
                  },
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
                ],
                stats: segment.stats,
              };
            }
          );
        setRoofSegments(newSegments);
      }
    };
    getSolarDataFromLocalStorage();
  }, []);

  useEffect(() => {
    const callGetDataLayers = async () => {
      if (solarData && triggeredDataLayers && !dataLayersRef.current) {
        const currentDataLayerAddress = secureLocalStorage.getItem(
          "currentDataLayerAddress"
        );
        //check if currentDataLayerAddress exists and is the same as address
        //this means we already got the data layers for this address and stored
        //the overlay in local storage
        //we can block the download of a new heatmap
        const currentHeatmapLocalStorage = secureLocalStorage.getItem(
          "heatmap"
        ) as string;
        if (
          currentDataLayerAddress &&
          currentDataLayerAddress === address &&
          currentHeatmapLocalStorage
        ) {
          setGetNewHeatmap(false);
          return;
        }
        const newDataLayers = await getDataLayers(
          solarData.latitude,
          solarData.longitude
        );
        if (newDataLayers) {
          dataLayersRef.current = JSON.parse(newDataLayers);
          setTriggeredDataLayers(false); // Reset the trigger
          secureLocalStorage.setItem("currentDataLayerAddress", address);
          secureLocalStorage.removeItem("heatmap");
        }
      }
    };
    callGetDataLayers();
  }, [solarData, triggeredDataLayers, setTriggeredDataLayers, address]);

  useEffect(() => {
    const downloadHeatmap = async () => {
      if (
        dataLayersRef.current?.maskUrl &&
        dataLayersRef.current?.annualFluxUrl &&
        apiKey &&
        map
      ) {
        const heatmap = await getHeatmap(dataLayersRef.current, apiKey);
        if (heatmap) {
          const bounds = heatmap.bounds;
          overlaysRef.current.forEach((overlay) => overlay.setMap(null));
          const newOverlays = heatmap
            .render(showHeatmap)
            .map(
              (canvas) =>
                new google.maps.GroundOverlay(canvas.toDataURL(), bounds)
            );

          overlaysRef.current = newOverlays;

          newOverlays[0].setMap(map);
          const heatmapData = {
            url: newOverlays[0].getUrl(),
            bounds: {
              north: newOverlays[0].getBounds()?.getNorthEast().lat(),
              south: newOverlays[0].getBounds()?.getSouthWest().lat(),
              east: newOverlays[0].getBounds()?.getNorthEast().lng(),
              west: newOverlays[0].getBounds()?.getSouthWest().lng(),
            },
          };
          secureLocalStorage.setItem("heatmap", JSON.stringify(heatmapData));
        }
      }
    };

    if (!showHeatmap) {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      return;
    }
    const heatmapStorageItem = secureLocalStorage.getItem("heatmap") as string;
    if (heatmapStorageItem && window.google) {
      const heatmapData = JSON.parse(heatmapStorageItem);
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          heatmapData.bounds.south,
          heatmapData.bounds.west
        ),
        new google.maps.LatLng(
          heatmapData.bounds.north,
          heatmapData.bounds.east
        )
      );

      const heatmapOverlay = new google.maps.GroundOverlay(
        heatmapData.url,
        bounds
      );
      overlaysRef.current[0] = heatmapOverlay;
      if (!getNewHeatmap) {
        overlaysRef.current[0].setMap(map);
        return;
      }
    } else if (dataLayersRef.current && !overlaysRef.current.length) {
      downloadHeatmap();
    }
  }, [map, apiKey, showHeatmap, getNewHeatmap]);

  useEffect(() => {
    if (showHeatmap && overlaysRef.current[0]) {
      overlaysRef.current[0].setMap(map);
    } else if (!showHeatmap && overlaysRef.current[0]) {
      overlaysRef.current[0].setMap(null);
    }
  }, [showHeatmap, map]);

  useEffect(() => {
    const getNewPanels = () => {
      if (solarData) {
        const solarPotential = solarData.building_insights.solarPotential;
        const newPanels: SolarPanel[] = solarPotential.solarPanels
          .slice(0, panelCount)
          .map((panel: any, index: number) => {
            const [w, h] = [
              solarPotential.panelWidthMeters / 2,
              solarPotential.panelHeightMeters / 2,
            ];
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
                  lat: +w,
                  lng: +h,
                },
                {
                  lat: +w,
                  lng: -h,
                },
                {
                  lat: -w,
                  lng: -h,
                },
                {
                  lat: -w,
                  lng: +h,
                },
                {
                  lat: +w,
                  lng: +h,
                },
              ],
              azimuth:
                solarData.building_insights.solarPotential.roofSegmentStats[
                  panel.segmentIndex
                ].azimuthDegrees,
              minEnergy:
                solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh,
              maxEnergy: solarPotential.solarPanels[0].yearlyEnergyDcKwh,
              width: w,
              height: h,
            };
          });
        setSolarPanels(newPanels);
      }
    };
    getNewPanels();
  }, [panelCount, solarData]);

  useEffect(() => {
    if (map) {
      // Clear existing polygons
      polygonsRef.current.forEach((polygon) => polygon.setMap(null));
      polygonsRef.current = [];

      // Add new panels if heatmap is not shown
      solarPanels.forEach((panel) => {
        const orientation = panel.orientation == "PORTRAIT" ? 90 : 0;
        const azimuth = panel.azimuth;
        const panelsPalette = ["E8EAF6", "1A237E"];
        const palette = createPalette(panelsPalette).map(rgbToColor);
        const minEnergy = panel.minEnergy;
        const maxEnergy = panel.maxEnergy;
        const colorIndex = Math.round(
          normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
        );
        const polygon = new google.maps.Polygon({
          paths: panel.corners.map(({ lat, lng }) =>
            google.maps.geometry.spherical.computeOffset(
              // Adjust the placement on the roof
              { lat: panel.center.lat, lng: panel.center.lng },
              Math.sqrt(lat * lat + lng * lng),
              Math.atan2(lng, lat) * (180 / Math.PI) + orientation + azimuth
            )
          ),
          fillColor: palette[colorIndex],
          fillOpacity: 0.9,
          strokeColor: "#B0BEC5",
          strokeOpacity: 0.9,
          strokeWeight: 1,
          zIndex: 1, // Ensure the panels appear above other map elements
        });
        polygon.setMap(map);
        polygon.addListener("click", () => handlePanelClick(panel));
        polygonsRef.current.push(polygon);
      });

      // Add the selected roof segment or all segments if showAllSegments is true
      const segmentsToShow = showAllSegments
        ? roofSegments
        : selectedSegment
        ? [selectedSegment]
        : [];
      segmentsToShow.forEach((segment) => {
        const polygon = new google.maps.Polygon({
          paths: segment.corners,
          fillColor: "#FFC107",
          fillOpacity: 0.3,
          strokeColor: "#D3D3D3",
          strokeOpacity: 0.4,
          strokeWeight: 3,
          zIndex: 1, // Ensure the panels appear above other map elements
        });
        polygon.setMap(map);
        polygonsRef.current.push(polygon);
      });
    }
  }, [map, solarPanels, roofSegments, selectedSegment, showAllSegments]);

  const handlePanelClick = (panel: SolarPanel) => {
    setSelectedPanel((prevSelectedPanel) =>
      prevSelectedPanel?.id === panel.id ? null : panel
    );
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
    <LoadScript googleMapsApiKey={apiKey!} libraries={libraries}>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{
            height: "100%",
            width: "100%",
            borderRadius: "16px",
          }}
          center={location}
          zoom={24}
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
