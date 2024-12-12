'use client';

import { useCallback } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 20,
  lng: 0
};

const defaultOptions = {
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

const getMarkerColor = (index, total) => {
  if (index === 0) return '#3B82F6'; // Starting point (blue)
  if (index === total - 1) return '#EF4444'; // End point (red)
  return '#34D399'; // Waypoints (green)
};

export default function Map({ 
  onLoad, 
  onUnmount, 
  city,
  routePlaces,
  directions 
}) {
  const handleLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    if (city) {
      bounds.extend(city.geometry.location);
    }
    if (routePlaces.length > 0) {
      routePlaces.forEach(place => {
        bounds.extend(place.geometry.location);
      });
    }
    map.fitBounds(bounds);
    onLoad(map);
  }, [city, routePlaces, onLoad]);

  console.log('routePlaces', routePlaces);
  console.log('directions', directions);
  const renderRouteDetails = () => {
    if (!directions || !directions.routes[0]) return null;

    const route = directions.routes[0];
    const path = route.overview_path.map(point => ({
      lat: point.lat(),
      lng: point.lng()
    }));

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mt-4 max-h-[400px] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Route Details</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-600 mb-2">Waypoints</h4>
            {routePlaces.map((place, index) => (
              <div key={index} className="mb-2">
                <div className="font-medium">{index + 1}. {place.name}</div>
                <div className="text-sm text-gray-600">
                  Lat: {place.geometry.location.lat}, Lng: {place.geometry.location.lng}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium text-blue-600 mb-2">Polyline Path Points</h4>
            <div className="text-sm text-gray-600">
              Total points: {path.length}
            </div>
            <div className="mt-2 max-h-[200px] overflow-y-auto">
              {path.map((point, index) => (
                <div key={index} className="text-xs text-gray-500">
                  Point {index + 1}: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={2}
          onLoad={handleLoad}
          onUnmount={onUnmount}
          options={defaultOptions}
        >
          {routePlaces.map((place, index) => (
            <Marker
              key={place.place_id || index}
              position={place.geometry.location}
              label={{
                text: (index + 1).toString(),
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: getMarkerColor(index, routePlaces.length),
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
                scale: 14
              }}
              title={place.name}
            />
          ))}

          {directions && directions.routes[0] && (
            <Polyline
              path={directions.routes[0].overview_path}
              options={{
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }}
            />
          )}
        </GoogleMap>
      </div>
      {renderRouteDetails()}
    </div>
  );
}
