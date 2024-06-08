"use server";
const postSolarData = async (
  address: string,
  longitude: number,
  latitude: number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  const postSolarDataUrl = new URL(
    "/api/solar_data",
    process.env.NEXT_FRONTEND_BASE_URL
  ).toString();
  try {
    const response = await fetch(postSolarDataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, longitude, latitude }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return {
        success: false,
        error: `Error posting solar data: ${response.statusText} - ${errorDetails.message}`,
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error(`Failed to post solar data for address: ${address}`, error);
    return { success: false, error: error.message };
  }
};

export default postSolarData;
