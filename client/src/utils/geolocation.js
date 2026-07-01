// Uses the browser Geolocation API + OpenStreetMap's free Nominatim reverse
// geocoding service to turn the user's coordinates into a city name.
//
// Note: the Geolocation API only works in secure contexts (HTTPS or
// localhost), and the user must grant location permission when prompted.

const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Asks the browser for the user's current coordinates.
 * @returns {Promise<GeolocationPosition>}
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

/**
 * Reverse-geocodes coordinates into a human-readable city name.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>}
 */
async function reverseGeocodeCity(latitude, longitude) {
  const url = `${REVERSE_GEOCODE_URL}?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) {
    throw new Error('Failed to look up your city');
  }

  const data = await res.json();
  const address = data.address || {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.state;

  if (!city) {
    throw new Error('Could not determine your city from your location');
  }

  return city;
}

/**
 * Detects the visitor's current city using the browser's geolocation
 * combined with reverse geocoding.
 * @returns {Promise<string>} resolved city name
 */
export async function detectCurrentCity() {
  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;
  return reverseGeocodeCity(latitude, longitude);
}
