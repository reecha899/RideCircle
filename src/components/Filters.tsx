'use client';

import { useState, useEffect, useRef } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterState {
  verified?: boolean;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  interests?: string[];
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const ALL_INTERESTS = [
  'Technology', 'Podcasts', 'Music', 'Books', 'Coffee', 'Fitness', 'Yoga',
  'Travel', 'Art', 'Design', 'Gaming', 'Sports', 'Cooking', 'Photography',
  'Sustainability', 'Wellness', 'Business', 'Networking', 'Reading',
  'Science', 'Nature', 'Fashion', 'Healthcare', 'Education'
];

export default function Filters({ onFilterChange, initialFilters }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const filterRef = useRef<HTMLDivElement>(null);
  const prevInitialFiltersRef = useRef<string>('');

  // Sync filters when initialFilters change (e.g., from URL restore)
  useEffect(() => {
    if (initialFilters !== undefined) {
      const currentStr = JSON.stringify(initialFilters);
      // Only update if initialFilters actually changed
      if (prevInitialFiltersRef.current !== currentStr) {
        prevInitialFiltersRef.current = currentStr;
        setFilters(initialFilters);
      }
    }
  }, [initialFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters };
    
    // If value is undefined, empty string, or empty array, remove the key
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
      >
        <Filter className="w-4 h-4 text-gray-700" />
        <span className="text-gray-700">Filters</span>
        {hasActiveFilters && (
          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.values(filters).filter(v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filter Results</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Verified Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification
              </label>
              <select
                value={filters.verified === undefined ? '' : filters.verified.toString()}
                onChange={(e) =>
                  handleFilterChange(
                    'verified',
                    e.target.value === '' ? undefined : e.target.value === 'true'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="" className="text-gray-900">All</option>
                <option value="true" className="text-gray-900">Verified Only</option>
                <option value="false" className="text-gray-900">Not Verified</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filters.gender || ''}
                onChange={(e) =>
                  handleFilterChange('gender', e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="" className="text-gray-900">All</option>
                <option value="Male" className="text-gray-900">Male</option>
                <option value="Female" className="text-gray-900">Female</option>
              </select>
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Age
                </label>
                <input
                  type="number"
                  value={filters.minAge || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'minAge',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Age
                </label>
                <input
                  type="number"
                  value={filters.maxAge || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'maxAge',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {ALL_INTERESTS.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.interests?.includes(interest) || false}
                      onChange={(e) => {
                        const current = filters.interests || [];
                        const updated = e.target.checked
                          ? [...current, interest]
                          : current.filter((i) => i !== interest);
                        handleFilterChange('interests', updated.length > 0 ? updated : undefined);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-900">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
