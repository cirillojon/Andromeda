"use server";
const solarApiBaseUrl = "https://solar.googleapis.com/v1";
const getDataLayers = async (lat: number, lng: number) => {
  const apiKey = process.env.SOLAR_API_KEY;
  if (apiKey) {
    const dataLayersUrl = `${solarApiBaseUrl}/dataLayers:get`;
    const params = new URLSearchParams({
      "location.latitude": lat.toString(),
      "location.longitude": lng.toString(),
      radiusMeters: "25",
      view: "IMAGERY_AND_ANNUAL_FLUX_LAYERS",
      key: apiKey,
    });

    try {
      const response = await fetch(`${dataLayersUrl}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error fetching data layers:", error);
      return null;
    }
  }
  else{
    console.error("No api key in data layers request");
    return null;
  }
};
export default getDataLayers;
