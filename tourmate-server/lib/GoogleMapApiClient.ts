/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Client,
  DistanceMatrixRequest,
  PlaceAutocompleteRequest,
  TravelMode,
  TravelRestriction,
  UnitSystem,
} from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import { parse } from 'path';

interface Waypoint {
  lat: number;
  lng: number;
}

interface City {
  name: string;
  place_id: string;
}

interface Location {
  lat: number;
  lng: number;
}


type Coordinate = {
  latLng: {
    latitude: number;
    longitude: number;
  };
};

type RouteRequest = {
  travelMode: TravelMode;
  origin: { location: Coordinate } | { address: string };
  destination: { location: Coordinate } | { address: string };
};

interface RouteStep {
  start_location: Location;
  end_location: Location;
}

interface Leg {
  steps: RouteStep[];
}

interface Route {
  legs: Leg[];
}

type DistanceInfos = {
  distanceInfos: { travelMode: TravelMode; info: Route }[];
  origin: string;
  destination: string;
};

const INTERESTING_TRAVEL_MODES = ['BICYCLE', 'DRIVE', 'WALK'];

export class GoogleMapApiClient {
  private readonly apiKey =
    process.env.GOOGLE_MAP_API_KEY || 'AIzaSyB6MfSTw3Glb0gIqVXb8WoMe1TeC3j6G9A';

  async getCitiesAlongRoute(
    origin: string,
    destination: string,
  ): Promise<string[]> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/directions/json',
        {
          params: {
            origin,
            destination,
            key: this.apiKey,
          },
        },
      );

      const route: Route = response.data.routes[0];

      if (!route) {
        throw new Error('No route found.');
      }

      const cities: string[] = [];
      const requests: Promise<string | null>[] = [];

      for (const leg of route.legs) {
        for (const step of leg.steps) {
          const startLocation = step.start_location;
          const endLocation = step.end_location;

          // Push the promises to the requests array without awaiting them yet
          requests.push(this.getCityName(startLocation.lat, startLocation.lng));
          requests.push(this.getCityName(endLocation.lat, endLocation.lng));
        }
      }

      // Await all the promises in parallel
      const cityResults = await Promise.all(requests);

      for (const cityName of cityResults) {
        if (cityName && !cities.includes(cityName)) {
          cities.push(cityName);
        }
      }
      console.log(this.filterCities(cities));
      return this.filterCities(cities);
    } catch (error) {
      console.error('Error occurred:', error);
      return [];
    }
  }

  // Filter out the same cities
  filterCities(cities: string[]): string[] {
    const cityNames: string[] = [];
    cities.filter((city) => {
      let parsedCityName: string[] = city.split(', ');
      const cityName = parsedCityName[parsedCityName.length - 2] + ', ' + parsedCityName[parsedCityName.length - 1];
      
      if (!cityNames.includes(cityName)) {
        cityNames.push(cityName);
      }
    });
    return cityNames;
  }

  private async getCityName(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${lat},${lng}`,
            key: this.apiKey,
          },
        },
      );
      
      const results = response.data.results;
      
      if (results.length > 0) {
        if (results[0].address_components[3]?.types.includes('administrative_area_level_1')) {
          return results[0].address_components[3].long_name + ', ' + results[0].address_components[4].long_name;
        } else if (results[0].address_components[4]?.types.includes('administrative_area_level_1')) {
          return results[0].address_components[4].long_name + ', ' + results[0].address_components[5].long_name;
        } else if (results[0].address_components[5]?.types.includes('administrative_area_level_1')) {
          return results[0].address_components[5].long_name + ', ' + results[0].address_components[6].long_name;
        }
        // Assuming the first result is the most relevant
        return results[0].formatted_address;
      }

      return null;
    } catch (error) {
      console.error('Error occurred:', error);
      return null;
    }
  }
}
