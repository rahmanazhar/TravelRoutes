'use client';

import { useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

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

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
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

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
