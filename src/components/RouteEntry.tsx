'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface RouteEntryProps {
  onRouteSubmit: (route: { from: string; to: string }) => void;
}

const POPULAR_LOCATIONS = [
  'Downtown Toronto',
  'North York',
  'Scarborough',
  'Markham',
  'Mississauga',
  'Etobicoke',
  'Richmond Hill',
];

export default function RouteEntry({ onRouteSubmit }: RouteEntryProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!from || !to) {
      setError('Please select both From and To locations');
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      setError('From and To locations cannot be the same');
      return;
    }

    onRouteSubmit({ from, to });
  };

  // Filter out the selected "to" location from "from" suggestions
  const filteredFromSuggestions = POPULAR_LOCATIONS.filter((loc) => {
    const matchesInput = loc.toLowerCase().includes(from.toLowerCase());
    const notSameAsTo = to === '' || loc.toLowerCase() !== to.toLowerCase();
    return matchesInput && notSameAsTo;
  });

  // Filter out the selected "from" location from "to" suggestions
  const filteredToSuggestions = POPULAR_LOCATIONS.filter((loc) => {
    const matchesInput = loc.toLowerCase().includes(to.toLowerCase());
    const notSameAsFrom = from === '' || loc.toLowerCase() !== from.toLowerCase();
    return matchesInput && notSameAsFrom;
  });

  const handleFromChange = (location: string) => {
    setFrom(location);
    setShowFromSuggestions(false);
    setError('');
    // If the selected "from" is the same as "to", clear "to"
    if (to.toLowerCase() === location.toLowerCase()) {
      setTo('');
    }
  };

  const handleToChange = (location: string) => {
    setTo(location);
    setShowToSuggestions(false);
    setError('');
    // If the selected "to" is the same as "from", clear it and show error
    if (from.toLowerCase() === location.toLowerCase()) {
      setTo('');
      setError('From and To locations cannot be the same');
    }
  };

  const isSameLocation = from && to && from.toLowerCase() === to.toLowerCase();
  const canSubmit = from && to && !isSameLocation;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setError('');
              }}
              onFocus={() => {
                setShowFromSuggestions(true);
                setShowToSuggestions(false);
              }}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              placeholder="Enter starting location"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                isSameLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {showFromSuggestions && filteredFromSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredFromSuggestions.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleFromChange(location)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setError('');
              }}
              onFocus={() => {
                setShowToSuggestions(true);
                setShowFromSuggestions(false);
              }}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              placeholder="Enter destination"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                isSameLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {showToSuggestions && filteredToSuggestions.length > 0 && (
              <div className="absolute z-30 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {filteredToSuggestions.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleToChange(location)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isSameLocation && !error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            From and To locations cannot be the same. Please select different locations.
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Search className="w-5 h-5" />
          Find Commute Buddies
        </button>
      </form>
    </div>
  );
}
