import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { SolarData } from "./SolarTypes";
import { RoofSegment } from "./SolarMap";

const useSolarData = (address: string) => {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([]);

  useEffect(() => {
    const storageItem = secureLocalStorage.getItem("solarData") as string;
    if (storageItem) {
      const data = JSON.parse(storageItem);
      setSolarData(data);
      const newSegments: RoofSegment[] =
        data.building_insights.solarPotential.roofSegmentStats.map(
          (segment: any, index: number) => ({
            id: `${segment.center.latitude}-${segment.center.longitude}-${index}`,
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
          })
        );
      setRoofSegments(newSegments);
    }
  }, [address]);

  return { solarData, roofSegments };
};

export default useSolarData;
