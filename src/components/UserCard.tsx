'use client';

import { User } from '@/types/user';
import { RouteMatch } from '@/types/user';
import { MessageCircle, MapPin, Shield, Clock, Navigation } from 'lucide-react';

interface UserCardProps {
  match: RouteMatch;
  onChatClick: (user: User) => void;
  onProfileClick: (user: User) => void;
}

export default function UserCard({ match, onChatClick, onProfileClick }: UserCardProps) {
  const { user } = match;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128&bold=true`}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-lg">${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>`;
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                {user.verified && (
                  <div className="group relative">
                    <div className="bg-blue-600 rounded-full p-1 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Verified
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{user.age} years • {user.gender}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{user.bio}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{user.from}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium">{user.to}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{user.commuteTime}</span>
            <span className="text-gray-400">•</span>
            <Navigation className="w-4 h-4" />
            <span>{user.routeDistance}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.slice(0, 3).map((interest, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
          {user.interests.length > 3 && (
            <span className="text-xs text-gray-500">+{user.interests.length - 3} more</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onChatClick(user)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
          <button
            onClick={() => onProfileClick(user)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
