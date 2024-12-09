'use client';

const formatDistance = (meters) => {
  if (!meters || meters === 0) return 'N/A';
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export default function TravelRoutes({ places, onReorder }) {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!places.length) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg">
            Add places to your route by clicking on suggestions
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Travel Route</h2>
      <div className="space-y-3">
        {places.map((place, index) => (
          <div
            key={place.place_id || index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            className="bg-blue-50 rounded-lg p-4 border border-blue-100
                     transform transition-all duration-200 hover:scale-[1.01]
                     cursor-move"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 
                               bg-blue-600 text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium text-blue-900">
                    {place.name}
                  </h3>
                </div>
                <p className="text-blue-700 mt-1">
                  {place.formatted_address || place.vicinity}
                </p>
                {index > 0 && place.distance && (
                  <p className="text-blue-600 text-sm mt-1">
                    Distance from previous: {formatDistance(place.distance)}
                  </p>
                )}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
