'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter a city name..."
          className="w-full h-14 px-6 rounded-full border-2 border-gray-200 
                   focus:border-blue-500 focus:outline-none text-lg shadow-sm
                   transition-all duration-200 pr-32"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !searchInput.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 
                   px-8 h-10 rounded-full bg-blue-500 text-white
                   hover:bg-blue-600 transition-colors duration-200
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   flex items-center justify-center min-w-[120px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
}
