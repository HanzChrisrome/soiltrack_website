//src/service/userPageService.ts

import supabase from "../../lib/supabase";

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "my-web-app/1.0 (extraryse1212@gmail.com)",
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error(`Reverse geocode failed: ${response.statusText}`);
  }

  const data = await response.json();
  const address = data.address || {};

  const road = address.road || "";
  const quarter = address.quarter || "";
  const village = address.village || "";
  const neighbourhood = address.neighbourhood || "";
  const town = address.town || "";
  const city = address.city || "";
  const municipality = address.municipality || "";
  const state = address.state || "";

  const resolvedCity = city || town || municipality || "";

  const locationParts = [
    road,
    neighbourhood,
    quarter,
    village,
    resolvedCity,
    state,
  ].filter((part) => part && part.trim().length > 0);

  return locationParts.join(", ");
}

export const getUserSummary = async (
  municipality: string,
  province: string
) => {
  console.log("Fetching user summary for:", municipality, province);

  if (!municipality || !province) {
    return console.warn("Municipality or province is not provided.");
  }

  const { data, error } = await supabase.rpc("get_users_summary", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    console.error("Error fetching user summary:", error);
    throw new Error(error.message);
  }

  return data;
};

// export const insertUserAccount = async (
//   userFname: string,
//   userLname: string,
//   userEmail: string,
//   polygonCoords: { lat: number; lng: number }[][]
// ) => {
//   const polygonAddresses = await Promise.all(
//     polygonCoords.map(async (polygon) => {
//       const firstCoord = polygon[0];
//       const lat = firstCoord.lat;
//       const lon = firstCoord.lng;
//       return reverseGeocode(lat, lon);
//     })
//   );

//   const data = {
//     userFname,
//     userLname,
//     userEmail,
//     polygonCoords,
//     polygonAddresses,
//   };

//   return null;
// };
