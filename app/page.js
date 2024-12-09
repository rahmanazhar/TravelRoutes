'use client';

import { useState, useCallback } from 'react';
import { LoadScript } from '@react-google-maps/api';
import SearchBar from './components/SearchBar';
import PlacesList from './components/PlacesList';
import TravelRoutes from './components/TravelRoutes';
import Map from './components/Map';
import { useMapOperations } from './hooks/useMapOperations';

const libraries = ['places', 'geometry'];

export default function Home() {
  const [map, setMap] = useState(null);
  const {
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
  } = useMapOperations(map);

  const handleMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Itinerary Planner
          </h1>
          <p className="text-lg text-gray-600">
            Search for a city to discover nearby attractions, restaurants, and more
          </p>
        </div>

        <SearchBar 
          onSearch={handleCitySearch} 
          loading={loading} 
        />

        {error && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Suggestions Panel */}
          <div className="xl:col-span-1">
            <PlacesList
              city={city}
              places={suggestions}
              loading={loading}
              onAddToRoute={addToRoute}
            />
          </div>

          {/* Map and Route Panel */}
          <div className="xl:col-span-2 space-y-8">
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              libraries={libraries}
            >
              <Map
                onLoad={handleMapLoad}
                onUnmount={handleMapUnmount}
                city={city}
                routePlaces={routePlaces}
                directions={directions}
              />
            </LoadScript>

            <TravelRoutes
              places={routePlaces}
              onReorder={reorderRoute}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
