'use client';

const formatDistance = (meters) => {
  if (!meters || meters === 0) return 'N/A';
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export default function PlacesList({ city, places, loading, onAddToRoute }) {
  // Group places by category
  const placesByCategory = places.reduce((acc, place) => {
    if (!acc[place.category]) {
      acc[place.category] = [];
    }
    acc[place.category].push(place);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="animate-pulse space-y-6">
          <div className="h-7 bg-gray-200 rounded-md w-1/3"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!city && !places.length) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg">
            Search for a city to discover places
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Suggested Places</h2>
      
      {Object.entries(placesByCategory).map(([category, categoryPlaces]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {category}
          </h3>
          <div className="space-y-3">
            {categoryPlaces.map((place, index) => (
              <div
                key={place.place_id || index}
                className="bg-green-50 rounded-lg p-4 border border-green-100
                         transform transition-all duration-200 hover:scale-[1.02]
                         cursor-pointer"
                onClick={() => onAddToRoute(place)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-green-900">
                      {place.name}
                    </h3>
                    <p className="text-green-700 mt-1">
                      {place.formatted_address || place.vicinity}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Distance from city: {formatDistance(place.distance)}
                    </p>
                  </div>
                  {place.rating && (
                    <div className="flex items-center space-x-1 bg-yellow-100 
                                  px-2 py-1 rounded-full">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-yellow-700">
                        {place.rating}
                      </span>
                    </div>
                  )}
                  <button
                    className="ml-4 px-3 py-1 bg-green-500 text-white rounded-full
                             hover:bg-green-600 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToRoute(place);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
