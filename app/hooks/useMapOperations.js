import { useState, useCallback, useEffect } from 'react';
import { searchCity, findAllNearbyPlaces, calculateOptimalRoute } from '../utils/mapServices';

export const useMapOperations = (map) => {
  const [city, setCity] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [routePlaces, setRoutePlaces] = useState([]);
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCitySearch = useCallback(async (cityName) => {
    if (!map || !cityName) return;

    setLoading(true);
    setError(null);
    try {
      const service = new google.maps.places.PlacesService(map);
      
      // Search for the city first
      const cityResult = await searchCity(service, cityName);
      
      // Ensure the city location is a proper LatLng object
      const cityLocation = new google.maps.LatLng(
        cityResult.geometry.location.lat(),
        cityResult.geometry.location.lng()
      );
      
      const cityWithLocation = {
        ...cityResult,
        geometry: {
          ...cityResult.geometry,
          location: cityLocation
        }
      };

      setCity(cityWithLocation);
      setRoutePlaces([cityWithLocation]); // Initialize route with city as starting point

      // Find all nearby places in different categories
      const nearbyPlaces = await findAllNearbyPlaces(service, cityLocation);
      
      // Ensure all places have proper LatLng objects
      const processedPlaces = nearbyPlaces.map(place => ({
        ...place,
        geometry: {
          ...place.geometry,
          location: new google.maps.LatLng(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          )
        }
      }));

      setSuggestions(processedPlaces);

      // Fit bounds to show all markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(cityLocation);
      processedPlaces.forEach(place => {
        bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
      
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [map]);

  const addToRoute = useCallback((place) => {
    // Ensure the place location is a proper LatLng object
    const placeLocation = new google.maps.LatLng(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );

    const processedPlace = {
      ...place,
      geometry: {
        ...place.geometry,
        location: placeLocation
      }
    };

    setRoutePlaces(current => {
      const newPlaces = [...current, processedPlace];
      // Update distances between consecutive places
      return newPlaces.map((place, index) => {
        if (index === 0) return place;
        const prevPlace = newPlaces[index - 1];
        return {
          ...place,
          distance: google.maps.geometry.spherical.computeDistanceBetween(
            prevPlace.geometry.location,
            place.geometry.location
          )
        };
      });
    });
  }, []);

  const reorderRoute = useCallback((fromIndex, toIndex) => {
    setRoutePlaces(current => {
      const newPlaces = [...current];
      const [movedPlace] = newPlaces.splice(fromIndex, 1);
      newPlaces.splice(toIndex, 0, movedPlace);
      
      // Recalculate distances after reordering
      return newPlaces.map((place, index) => {
        if (index === 0) return place;
        const prevPlace = newPlaces[index - 1];
        return {
          ...place,
          distance: google.maps.geometry.spherical.computeDistanceBetween(
            prevPlace.geometry.location,
            place.geometry.location
          )
        };
      });
    });
  }, []);

  // Update directions whenever route changes
  const updateDirections = useCallback(async () => {
    if (routePlaces.length < 2 || !map) return;

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await calculateOptimalRoute(directionsService, routePlaces);
      setDirections(result);
    } catch (err) {
      console.error('Failed to update directions:', err);
    }
  }, [routePlaces, map]);

  useEffect(() => {
    updateDirections();
  }, [routePlaces, updateDirections]);

  const clearAll = useCallback(() => {
    setCity(null);
    setSuggestions([]);
    setRoutePlaces([]);
    setDirections(null);
    setError(null);
    if (map) {
      map.setCenter({ lat: 20, lng: 0 });
      map.setZoom(2);
    }
  }, [map]);

  return {
    city,
    suggestions,
    routePlaces,
    directions,
    loading,
    error,
    handleCitySearch,
    addToRoute,
    reorderRoute,
    clearAll
  };
};
