import { Client, DistanceMatrixRequest, PlaceAutocompleteRequest, TravelMode, TravelRestriction, UnitSystem } from '@googlemaps/google-maps-services-js';
import axios from 'axios';

interface Waypoint {
  lat: number;
  lng: number;
}

interface City {
  name: string;
  place_id: string;
}


function calculateIntermediateWaypoint(origin: string, destination: string, distanceToWaypoint: number): Waypoint {
  // Convert origin and destination to LatLng coordinates
  const originLatLng = { lat: parseFloat(origin.split(',')[0]), lng: parseFloat(origin.split(',')[1]) };
  const destinationLatLng = { lat: parseFloat(destination.split(',')[0]), lng: parseFloat(destination.split(',')[1]) };

  // Calculate bearing from origin to destination
  const lat1 = originLatLng.lat * (Math.PI / 180);
  const lon1 = originLatLng.lng * (Math.PI / 180);
  const lat2 = destinationLatLng.lat * (Math.PI / 180);
  const lon2 = destinationLatLng.lng * (Math.PI / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;

  // Calculate intermediate waypoint coordinates
  const R = 6371000; // Earth's radius in meters
  const d = distanceToWaypoint;
  const lat3 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(bearing));
  const lon3 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat3));

  return { lat: (lat3 * 180) / Math.PI, lng: (lon3 * 180) / Math.PI };
}

async function findClosestCity(waypoint: Waypoint, apiKey: string): Promise<City> {
  const client = new Client({});
  const autocompleteRequest: PlaceAutocompleteRequest = {
    params: {
      input: 'city', // You can modify the search type here (e.g., 'restaurant', 'hospital', etc.)
      location: `${waypoint.lat},${waypoint.lng}`,
      key: apiKey,
      radius: 50000, // Search within 50 km radius of the waypoint
    },
  };

  const response = await client.placeAutocomplete(autocompleteRequest);
  if (response.data.predictions.length === 0) {
    throw new Error('No cities found near the waypoint.');
  }

  const city = response.data.predictions[0];
  return {
    name: city.description,
    place_id: city.place_id,
  };
}

async function calculateDistance(origin: string, destination: string, apiKey: string): Promise<number> {
  if (!origin || !destination || !apiKey) {
    throw new Error('Invalid parameters.');
  }

  const client = new Client({});
  try {
    const distanceMatrixRequest: DistanceMatrixRequest = {
      params: {
        origins: [origin],
        destinations: [destination],
        key: apiKey,
        mode: TravelMode.driving, // Set the travel mode here if needed
        units: UnitSystem.metric, // Set the unit system here if needed
        avoid: [TravelRestriction.tolls, TravelRestriction.highways],
      },
    };

    const response = await client.distancematrix(distanceMatrixRequest).catch((error) => {
      console.error('An error occurred while calculating the distance:', error);
      throw new Error('An error occurred while calculating the distance: ', error);
    });

    const { rows } = response.data;
    if (rows.length === 0) {
      throw new Error('No distance information available for the given locations.');
    }

    const elements = rows[0].elements;
    if (elements.length === 0 || elements[0].status !== 'OK') {
      throw new Error('Unable to calculate the distance between the locations.');
    }

    const distance = elements[0].distance.value;

    console.log('Distance:', distance);
    // Determine the number of waypoints required
    const numWaypoints = Math.floor(distance / 100000); // 100000 meters = 100 km
    const segmentDistance = distance / (numWaypoints + 1);

    // Calculate the waypoints
    const waypoints: Waypoint[] = [];
    for (let i = 1; i <= numWaypoints; i++) {
      const distanceToWaypoint = segmentDistance * i;
      const waypoint = calculateIntermediateWaypoint(origin, destination, distanceToWaypoint);
      waypoints.push(waypoint);
    }

    console.log('Waypoints:', waypoints);

    // Find the closest cities to each waypoint
    const closestCities: City[] = [];
    for (const waypoint of waypoints) {
      const city = await findClosestCity(waypoint, apiKey);
      closestCities.push(city);
    }

    console.log('Closest Cities:', closestCities);

    
    return distance;
  } catch (error) {
    console.error('An error occurred while calculating the distance:', error);
    throw error;
  }
}

export default calculateDistance;

interface Location {
  lat: number;
  lng: number;
}

interface RouteStep {
  start_location: Location;
  end_location: Location;
}

interface Route {
  legs: {
    steps: RouteStep[];
  }[];
}

interface GeocodingResult {
  formatted_address: string;
}
async function getCityName(apiKey: string, lat: number, lng: number): Promise<string | null> {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: apiKey,
      },
    });

    const results: GeocodingResult[] = response.data.results;

    if (results.length > 0) {
      // Assuming the first result is the most relevant
      return results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error('Error occurred:', error);
    return null;
  }
}

export async function getCitiesAlongRoute(origin: string, destination: string, apiKey: string): Promise<string[]> {
  try {

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: apiKey,
      },
    });

    const route: Route = response.data.routes[0];
    console.log('response:', response);
    if (!route) {
      throw new Error('No route found.');
    }

    const cities: string[] = [];

    for (const leg of route.legs) {
      for (const step of leg.steps) {
        const startLocation = step.start_location;
        const endLocation = step.end_location;
        
        // You can add more logic here to determine the city or locality
        // You could use a geocoding API to reverse geocode the latitude and longitude
        // into a city name, for example.
        const city1 = await getCityName(apiKey, startLocation.lat, startLocation.lng);
        if (city1 && !cities.includes(city1)) {
          cities.push(city1);
        }

        const city2 = await getCityName(apiKey, endLocation.lat, endLocation.lng);
        if (city2 && !cities.includes(city2)) {
          cities.push(city2);
        }
      }
    }
    console.log('Cities:', cities);
    return cities;
  } catch (error) {
    console.error('Error occurred:', error);
    return [];
  }
}
