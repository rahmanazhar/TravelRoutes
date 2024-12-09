const PLACE_CATEGORIES = [
  { type: 'lodging', label: 'Hotels', limit: 3 },
  { type: 'restaurant', label: 'Restaurants', limit: 3 },
  { type: 'tourist_attraction', label: 'Attractions', limit: 3 },
  { type: 'park', label: 'Nature', limit: 2 },
  { type: 'amusement_park', label: 'Adventure', limit: 2 }
];

const processLocation = (location) => {
  if (!location) return null;
  if (location.lat && typeof location.lat === 'function') {
    return new google.maps.LatLng(location.lat(), location.lng());
  }
  if (typeof location.lat === 'number') {
    return new google.maps.LatLng(location.lat, location.lng);
  }
  return location;
};

const processPlaceResult = (place) => {
  if (!place) return null;
  const location = processLocation(place.geometry?.location);
  if (!location) return null;

  return {
    ...place,
    geometry: {
      ...place.geometry,
      location: location
    }
  };
};

export const searchCity = async (service, query) => {
  return new Promise((resolve, reject) => {
    const request = {
      query: query,
      fields: ['name', 'geometry', 'formatted_address', 'place_id']
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        service.getDetails(
          {
            placeId: results[0].place_id,
            fields: ['name', 'geometry', 'formatted_address', 'place_id']
          },
          (place, detailStatus) => {
            if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
              const processedPlace = processPlaceResult(place);
              if (processedPlace) {
                resolve(processedPlace);
              } else {
                reject(new Error('Invalid place data'));
              }
            } else {
              reject(new Error('Failed to get place details'));
            }
          }
        );
      } else {
        reject(new Error('City not found'));
      }
    });
  });
};

const getPlaceDetails = async (service, placeId) => {
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'geometry', 'formatted_address', 'rating', 'place_id', 'vicinity']
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const processedPlace = processPlaceResult(place);
          if (processedPlace) {
            resolve(processedPlace);
          } else {
            reject(new Error('Invalid place data'));
          }
        } else {
          reject(new Error('Failed to get place details'));
        }
      }
    );
  });
};

export const findPlacesByCategory = async (service, location, category) => {
  return new Promise(async (resolve, reject) => {
    const processedLocation = processLocation(location);
    if (!processedLocation) {
      resolve([]);
      return;
    }

    const request = {
      location: processedLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: category.type
    };

    service.nearbySearch(request, async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        try {
          const detailedPlaces = await Promise.all(
            results.slice(0, category.limit).map(async (place) => {
              try {
                const details = await getPlaceDetails(service, place.place_id);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                  processedLocation,
                  details.geometry.location
                );
                return {
                  ...details,
                  category: category.label,
                  distance: distance
                };
              } catch (error) {
                console.error('Error getting place details:', error);
                return null;
              }
            })
          );

          resolve(detailedPlaces.filter(place => place !== null));
        } catch (error) {
          console.error('Error processing places:', error);
          resolve([]);
        }
      } else {
        resolve([]); // Resolve with empty array if no places found
      }
    });
  });
};

export const findAllNearbyPlaces = async (service, cityLocation) => {
  try {
    const processedLocation = processLocation(cityLocation);
    if (!processedLocation) {
      return [];
    }

    const allPlacesPromises = PLACE_CATEGORIES.map(category =>
      findPlacesByCategory(service, processedLocation, category)
    );

    const categorizedPlaces = await Promise.all(allPlacesPromises);
    
    // Flatten and sort all places by distance
    const allPlaces = categorizedPlaces
      .flat()
      .sort((a, b) => a.distance - b.distance);

    return allPlaces;
  } catch (error) {
    console.error('Error finding nearby places:', error);
    return [];
  }
};

export const calculateOptimalRoute = async (directionsService, places) => {
  if (places.length < 2) return null;

  return new Promise((resolve, reject) => {
    const processedPlaces = places.map(place => ({
      ...place,
      geometry: {
        ...place.geometry,
        location: processLocation(place.geometry.location)
      }
    }));

    const origin = processedPlaces[0].geometry.location;
    const destination = processedPlaces[processedPlaces.length - 1].geometry.location;
    const waypoints = processedPlaces.slice(1, -1).map(place => ({
      location: place.geometry.location,
      stopover: true
    }));

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result);
          resolve(result);
        } else {
          reject(new Error('Failed to calculate route'));
        }
      }
    );
  });
};
