'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { ArrowLeft, MapPin, Clock, Navigation, Shield, MessageCircle, Sparkles } from 'lucide-react';
import usersData from '@/data/users.json';
import ChatInterface from '@/components/ChatInterface';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const foundUser = usersData.find((u) => u.id === params.id);
    if (foundUser) {
      setUser(foundUser as User);
    }
  }, [params.id]);

  const handleBack = () => {
    // Preserve search params when going back
    const currentParams = searchParams.toString();
    const url = currentParams ? `/?${currentParams}` : '/';
    router.push(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Results</span>
          </button>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-lg">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128&bold=true`}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-32 h-32 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold text-2xl">${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>`;
                        }
                      }}
                    />
                  </div>
                  <div className="text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{user.name}</h1>
                      {user.verified && (
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-blue-100 text-lg">
                      {user.age} years • {user.gender}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>

              {/* Route Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Commute Route</h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">From</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{user.from}</p>
                    </div>
                    <div className="text-blue-600 text-2xl">→</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">To</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{user.to}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{user.commuteTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{user.routeDistance}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-3">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Preferred Gender:</span>{' '}
                    {user.preferredGender}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <ChatInterface user={user} onClose={() => setShowChat(false)} />
      )}
    </>
  );
}
