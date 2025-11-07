'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { User as UserIcon, LogOut, Edit } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import { getCurrentUser, clearCurrentUser, saveCurrentUser } from '@/utils/storage';

interface UserProfileProps {
  onUpdate: (user: User | null) => void;
  currentUser?: User | null;
}

export default function UserProfile({ onUpdate, currentUser: propCurrentUser }: UserProfileProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [internalUser, setInternalUser] = useState<User | null>(null);

  // Use prop if provided, otherwise use internal state
  const currentUser = propCurrentUser !== undefined ? propCurrentUser : internalUser;

  useEffect(() => {
    if (propCurrentUser === undefined) {
      // Only load from storage if prop is not provided
      const user = getCurrentUser();
      setInternalUser(user);
    }
  }, [propCurrentUser]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const user = getCurrentUser();
      if (propCurrentUser === undefined) {
        setInternalUser(user);
      }
      onUpdate(user);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [propCurrentUser, onUpdate]);

  const loadUser = () => {
    const user = getCurrentUser();
    if (propCurrentUser === undefined) {
      setInternalUser(user);
    }
  };

  const handleProfileClick = () => {
    loadUser();
    const userToCheck = propCurrentUser !== undefined ? propCurrentUser : getCurrentUser();
    if (userToCheck) {
      setShowProfile(true);
    } else {
      setShowEditForm(true);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleFormComplete = (user: User) => {
    saveCurrentUser(user);
    if (propCurrentUser === undefined) {
      setInternalUser(user);
    }
    setShowEditForm(false);
    setShowProfile(false);
    onUpdate(user);
  };

  const handleFormSkip = () => {
    setShowEditForm(false);
    if (!currentUser) {
      setShowProfile(false);
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    if (propCurrentUser === undefined) {
      setInternalUser(null);
    }
    setShowProfile(false);
    onUpdate(null);
  };

  if (showEditForm) {
    return (
      <RegistrationForm
        onComplete={handleFormComplete}
        onSkip={handleFormSkip}
        existingUser={currentUser}
      />
    );
  }

  return (
    <>
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="relative">
          {currentUser ? (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <UserIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>
        {currentUser && (
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {currentUser.name.split(' ')[0]}
          </span>
        )}
      </button>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {currentUser ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
                    <p className="text-gray-500">{currentUser.age} years • {currentUser.gender}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Route</label>
                      <p className="text-gray-900">{currentUser.from} → {currentUser.to}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Commute Time</label>
                      <p className="text-gray-900">{currentUser.commuteTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Distance</label>
                      <p className="text-gray-900">{currentUser.routeDistance}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-900">{currentUser.bio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Interests</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentUser.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6">No profile created yet</p>
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

