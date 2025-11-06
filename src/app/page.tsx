'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RouteEntry from '@/components/RouteEntry';
import MatchingResults from '@/components/MatchingResults';
import Filters from '@/components/Filters';
import RouteMap from '@/components/RouteMap';
import ChatInterface from '@/components/ChatInterface';
import { User, RouteMatch } from '@/types/user';
import { findMatchingUsers, filterUsers } from '@/utils/matching';
import usersData from '@/data/users.json';
import { Users, MessageCircle, Map } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentRoute, setCurrentRoute] = useState<{ from: string; to: string } | null>(null);
  const [matches, setMatches] = useState<RouteMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<RouteMatch[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore state from URL on mount
  useEffect(() => {
    if (isInitialized) return;
    
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    if (from && to) {
      const route = { from, to };
      setCurrentRoute(route);
      const foundMatches = findMatchingUsers(route, usersData as User[]);
      setMatches(foundMatches);
      
      // Restore filters from URL
      const restoredFilters: any = {};
      const verified = searchParams.get('verified');
      if (verified !== null) restoredFilters.verified = verified === 'true';
      const gender = searchParams.get('gender');
      if (gender) restoredFilters.gender = gender;
      const minAge = searchParams.get('minAge');
      if (minAge) restoredFilters.minAge = parseInt(minAge);
      const maxAge = searchParams.get('maxAge');
      if (maxAge) restoredFilters.maxAge = parseInt(maxAge);
      const interests = searchParams.get('interests');
      if (interests) restoredFilters.interests = interests.split(',');
      
      setFilters(restoredFilters);
      const filtered = filterUsers(foundMatches, restoredFilters);
      setFilteredMatches(filtered);
    }
    
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Update URL when route or filters change
  const updateURL = (route: { from: string; to: string } | null, filterState: any) => {
    if (!route) {
      router.push('/');
      return;
    }

    const params = new URLSearchParams();
    params.set('from', route.from);
    params.set('to', route.to);
    
    if (filterState.verified !== undefined) {
      params.set('verified', filterState.verified.toString());
    }
    if (filterState.gender) {
      params.set('gender', filterState.gender);
    }
    if (filterState.minAge) {
      params.set('minAge', filterState.minAge.toString());
    }
    if (filterState.maxAge) {
      params.set('maxAge', filterState.maxAge.toString());
    }
    if (filterState.interests && filterState.interests.length > 0) {
      params.set('interests', filterState.interests.join(','));
    }
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleRouteSubmit = (route: { from: string; to: string }) => {
    setCurrentRoute(route);
    const foundMatches = findMatchingUsers(route, usersData as User[]);
    setMatches(foundMatches);
    // Reset filters when route changes
    const emptyFilters = {};
    setFilters(emptyFilters);
    // Apply any existing filters to the new matches
    const filtered = filterUsers(foundMatches, emptyFilters);
    setFilteredMatches(filtered);
    // Update URL
    updateURL(route, emptyFilters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Always filter from the original matches, not filteredMatches
    const filtered = filterUsers(matches, newFilters);
    setFilteredMatches(filtered);
    // Update URL with new filters
    if (currentRoute) {
      updateURL(currentRoute, newFilters);
    }
  };

  const handleChatClick = (user: User) => {
    setSelectedChatUser(user);
  };

  const handleProfileClick = (user: User) => {
    // Preserve current search params when navigating to profile
    const currentParams = searchParams.toString();
    const url = currentParams ? `/profile/${user.id}?${currentParams}` : `/profile/${user.id}`;
    router.push(url);
  };

  const handleCloseChat = () => {
    setSelectedChatUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl">
                RC
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RideCircle</h1>
                <p className="text-sm text-gray-500">Connect with your commute community</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{usersData.length} Commuters</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentRoute ? (
          // Initial State - Route Entry
          <div className="text-center py-16">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Commute Buddies
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with people who share your daily route. Carpool, chat, or simply make new friends on your commute!
              </p>
            </div>
            <RouteEntry onRouteSubmit={handleRouteSubmit} />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Map className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Route Matching</h3>
                <p className="text-sm text-gray-600">
                  Find commuters with overlapping routes automatically
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">AI Chat Assist</h3>
                <p className="text-sm text-gray-600">
                  Chat with AI assistants to connect with other commuters
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community Building</h3>
                <p className="text-sm text-gray-600">
                  Build connections and reduce isolation in your daily commute
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-6">
            {/* Route Info & Map */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Route</h2>
                  <p className="text-gray-600">
                    {currentRoute.from} → {currentRoute.to}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentRoute(null);
                    setMatches([]);
                    setFilteredMatches([]);
                    setFilters({});
                    router.push('/');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change Route
                </button>
              </div>
              <RouteMap from={currentRoute.from} to={currentRoute.to} />
            </div>

            {/* Filters & Results Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Found {filteredMatches.length} {filteredMatches.length === 1 ? 'Match' : 'Matches'}
              </h3>
              <Filters onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>

            {/* Matching Results */}
            <MatchingResults
              matches={filteredMatches}
              onChatClick={handleChatClick}
              onProfileClick={handleProfileClick}
            />
          </div>
        )}
      </main>

      {/* Chat Interface */}
      {selectedChatUser && (
        <ChatInterface user={selectedChatUser} onClose={handleCloseChat} />
      )}
    </div>
  );
}