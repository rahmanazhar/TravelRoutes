'use client';

import { useState, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Map from '../components/Map';
import TravelRoutes from '../components/TravelRoutes';

const malaysiaLocations = [
  {
    name: "Johor Bahru, Johor",
    geometry: {
      location: { lat: 1.4927, lng: 103.7414 }
    },
    formatted_address: "Johor Bahru, Johor, Malaysia",
    place_id: "johor_bahru"
  },
//   {
//     name: "Muar, Johor",
//     geometry: {
//       location: { lat: 2.0442, lng: 102.5689 }
//     },
//     formatted_address: "Muar, Johor, Malaysia",
//     place_id: "muar"
//   },
//   {
//     name: "Melaka City",
//     geometry: {
//       location: { lat: 2.1896, lng: 102.2501 }
//     },
//     formatted_address: "Melaka, Malaysia",
//     place_id: "melaka"
//   },
//   {
//     name: "Seremban, Negeri Sembilan",
//     geometry: {
//       location: { lat: 2.7258, lng: 101.9424 }
//     },
//     formatted_address: "Seremban, Negeri Sembilan, Malaysia",
//     place_id: "seremban"
//   },
//   {
//     name: "Kuala Lumpur",
//     geometry: {
//       location: { lat: 3.1390, lng: 101.6869 }
//     },
//     formatted_address: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
//     place_id: "kl"
//   },
//   {
//     name: "Ipoh, Perak",
//     geometry: {
//       location: { lat: 4.5975, lng: 101.0901 }
//     },
//     formatted_address: "Ipoh, Perak, Malaysia",
//     place_id: "ipoh"
//   },
//   {
//     name: "Butterworth, Penang",
//     geometry: {
//       location: { lat: 5.3991, lng: 100.3638 }
//     },
//     formatted_address: "Butterworth, Penang, Malaysia",
//     place_id: "butterworth"
//   },
//   {
//     name: "Alor Setar, Kedah",
//     geometry: {
//       location: { lat: 6.1264, lng: 100.3673 }
//     },
//     formatted_address: "Alor Setar, Kedah, Malaysia",
//     place_id: "alor_setar"
//   },
  {
    name: "Kangar, Perlis",
    geometry: {
      location: { lat: 6.4414, lng: 100.1986 }
    },
    formatted_address: "Kangar, Perlis, Malaysia",
    place_id: "kangar"
  }
];

export default function MalaysiaRoute() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState(malaysiaLocations);
  const [directions, setDirections] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onLoad = useCallback((map) => {
    setMap(map);
    calculateRoute(malaysiaLocations);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const formatRouteDetails = (result) => {
    if (!result || !result.routes[0]) return null;

    const route = result.routes[0];
    const path = route.overview_path.map(point => ({
      latitude: point.lat(),
      longitude: point.lng()
    }));

    // Calculate total distance and duration
    const totalDistance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000; // Convert to km
    const totalDuration = route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60; // Convert to minutes

    return {
      coordinates: path,
      distance: totalDistance,
      duration: totalDuration,
      fares: [null], // Placeholder for fare information
      legs: route.legs.map(leg => ({
        distance: leg.distance,
        duration: leg.duration,
        end_address: leg.end_address,
        end_location: leg.end_location,
        start_address: leg.start_address,
        start_location: leg.start_location,
        steps: leg.steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          end_location: step.end_location,
          html_instructions: step.instructions,
          polyline: step.polyline,
          start_location: step.start_location,
          travel_mode: step.travel_mode
        })),
        traffic_speed_entry: [],
        via_waypoint: []
      })),
      waypointOrder: [route.waypoint_order]
    };
  };

  const calculateRoute = async (waypoints) => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const middlePoints = waypoints.slice(1, -1);

    const request = {
      origin: origin.geometry.location,
      destination: destination.geometry.location,
      waypoints: middlePoints.map(point => ({
        location: point.geometry.location,
        stopover: true
      })),
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        const formattedRoute = formatRouteDetails(result);
        setRouteDetails(formattedRoute);
        console.log('Route Details:', formattedRoute);
        
        // Update distances
        const legs = result.routes[0].legs;
        const updatedPlaces = places.map((place, index) => ({
          ...place,
          distance: index > 0 ? legs[index - 1].distance.value : 0
        }));
        setPlaces(updatedPlaces);
      }
    });
  };

  const handleReorder = (dragIndex, dropIndex) => {
    const reorderedPlaces = [...places];
    const [removed] = reorderedPlaces.splice(dragIndex, 1);
    reorderedPlaces.splice(dropIndex, 0, removed);
    setPlaces(reorderedPlaces);
    calculateRoute(reorderedPlaces);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading maps...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Johor to Perlis Route
      </h1>
      <p className="text-gray-600 mb-6">
        A comprehensive route from the southernmost state (Johor) to the northernmost state (Perlis) of Peninsular Malaysia, 
        passing through major cities along the North-South Highway.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Map
            onLoad={onLoad}
            onUnmount={onUnmount}
            routePlaces={places}
            directions={directions}
          />
          {routeDetails && (
            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Route Summary</h2>
              <div className="space-y-2">
                <p>Total Distance: {routeDetails.distance.toFixed(2)} km</p>
                <p>Total Duration: {routeDetails.duration.toFixed(2)} minutes</p>
                <p>Total Waypoints: {places.length}</p>
              </div>
            </div>
          )}
        </div>
        <div>
          <TravelRoutes
            places={places}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </div>
  );
}
