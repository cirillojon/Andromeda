import { DataLayersResponse } from "@/components/Onboarding/Form/SolarTypes";
import { renderPalette } from "@/components/Onboarding/Form/SubFormComponents/Visualize";
import { TypedArray, fromArrayBuffer } from "geotiff";
import * as geokeysToProj4 from "geotiff-geokeys-to-proj4";
import proj4 from "proj4";

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds: Bounds;
}
export interface Palette {
  colors: string[];
  min: string;
  max: string;
}

export interface Layer {
  id: string;
  render: (
    showRoofOnly: boolean,
  ) => HTMLCanvasElement[];
  bounds: Bounds;
  palette?: Palette;
}

export async function downloadGeoTIFF(url: string): Promise<GeoTiff> {
  const apiKey = 'AIzaSyDJN64pFF7zu8SLCI3MRajkuuMrWvfs0MU';
  console.log(`Downloading data layer: ${url}`);

  // Include your Google Cloud API key in the Data Layers URL.
  const solarUrl = url.includes("solar.googleapis.com")
    ? url + `&key=${apiKey}`
    : url;
  const response = await fetch(solarUrl);
  if (response.status != 200) {
    const error = await response.json();
    console.error(`downloadGeoTIFF failed: ${solarUrl}\n`, error);
    throw error;
  }
  console.log("response:", response);

  // Get the GeoTIFF rasters, which are the pixel values for each band.
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const rasters = await image.readRasters();

  // Reproject the bounding box into lat/lon coordinates.
  const geoKeys = image.getGeoKeys();
  const projObj = geokeysToProj4.toProj4(geoKeys);
  const projection = proj4(projObj.proj4, "WGS84");
  const box = image.getBoundingBox();
  const sw = projection.forward({
    x: box[0] * projObj.coordinatesConversionParameters.x,
    y: box[1] * projObj.coordinatesConversionParameters.y,
  });
  const ne = projection.forward({
    x: box[2] * projObj.coordinatesConversionParameters.x,
    y: box[3] * projObj.coordinatesConversionParameters.y,
  });

  return {
    // Width and height of the data layer image in pixels.
    // Used to know the row and column since Javascript
    // stores the values as flat arrays.
    width: rasters.width,
    height: rasters.height,
    // Each raster reprents the pixel values of each band.
    // We convert them from `geotiff.TypedArray`s into plain
    // Javascript arrays to make them easier to process.
    rasters: [...Array(rasters.length).keys()].map((i) =>
      Array.from(rasters[i] as TypedArray)
    ),
    // The bounding box as a lat/lon rectangle.
    bounds: {
      north: ne.y,
      south: sw.y,
      east: ne.x,
      west: sw.x,
    },
  };
}

export async function getHeatmap(urls: DataLayersResponse): Promise<Layer | null> {
  const [mask, data] = await Promise.all([
    downloadGeoTIFF(urls.maskUrl),
    downloadGeoTIFF(urls.annualFluxUrl),
  ]);
  const colors = ['00000A', '91009C', 'E64616', 'FEB400', 'FFFFF6'];;
  return {
    id: 'annualFlux',
    bounds: mask.bounds,
    palette: {
      colors: colors,
      min: "Shady",
      max: "Sunny",
    },
    render: (showRoofOnly) => [
      renderPalette({
        data: data,
        mask: showRoofOnly ? mask : undefined,
        colors: colors,
        min: 0,
        max: 1800,
      }),
    ],
  };
}