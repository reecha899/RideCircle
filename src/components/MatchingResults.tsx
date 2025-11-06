'use client';

import { RouteMatch } from '@/types/user';
import { User } from '@/types/user';
import UserCard from './UserCard';

interface MatchingResultsProps {
  matches: RouteMatch[];
  onChatClick: (user: User) => void;
  onProfileClick: (user: User) => void;
}

export default function MatchingResults({
  matches,
  onChatClick,
  onProfileClick,
}: MatchingResultsProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No matching commuters found.</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your route or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <UserCard
          key={match.user.id}
          match={match}
          onChatClick={onChatClick}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
