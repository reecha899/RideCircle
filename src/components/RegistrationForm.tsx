'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { X, MapPin, Clock, Navigation } from 'lucide-react';

interface RegistrationFormProps {
  onComplete: (user: User) => void;
  onSkip: () => void;
  existingUser?: User | null;
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

const ALL_INTERESTS = [
  'Technology', 'Podcasts', 'Music', 'Books', 'Coffee', 'Fitness', 'Yoga',
  'Travel', 'Art', 'Design', 'Gaming', 'Sports', 'Cooking', 'Photography',
  'Sustainability', 'Wellness', 'Business', 'Networking', 'Reading',
  'Science', 'Nature', 'Fashion', 'Healthcare', 'Education'
];

export default function RegistrationForm({ onComplete, onSkip, existingUser }: RegistrationFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: existingUser?.name || '',
    age: existingUser?.age || undefined,
    gender: existingUser?.gender || '',
    from: existingUser?.from || '',
    to: existingUser?.to || '',
    bio: existingUser?.bio || '',
    interests: existingUser?.interests || [],
    verified: existingUser?.verified || false,
    commuteTime: existingUser?.commuteTime || '',
    routeDistance: existingUser?.routeDistance || '',
    preferredGender: existingUser?.preferredGender || 'Any',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.from || formData.from.trim().length === 0) {
      newErrors.from = 'Please enter your starting location';
    }

    if (!formData.to || formData.to.trim().length === 0) {
      newErrors.to = 'Please enter your destination';
    }

    if (formData.from && formData.to && formData.from.toLowerCase() === formData.to.toLowerCase()) {
      newErrors.to = 'From and To locations cannot be the same';
    }

    if (!formData.bio || formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    }

    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }

    if (!formData.commuteTime) {
      newErrors.commuteTime = 'Please enter your commute time';
    }

    if (!formData.routeDistance) {
      newErrors.routeDistance = 'Please enter route distance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const userData: User = {
      id: existingUser?.id || Date.now().toString(),
      name: formData.name!,
      age: formData.age!,
      gender: formData.gender!,
      from: formData.from!,
      to: formData.to!,
      bio: formData.bio!,
      interests: formData.interests!,
      verified: formData.verified || false,
      profileImage: existingUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name!)}&background=3b82f6&color=fff&size=128&bold=true`,
      commuteTime: formData.commuteTime!,
      routeDistance: formData.routeDistance!,
      preferredGender: formData.preferredGender || 'Any',
    };

    onComplete(userData);
  };

  const handleInterestToggle = (interest: string) => {
    const current = formData.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setFormData({ ...formData, interests: updated });
    if (errors.interests) {
      setErrors({ ...errors, interests: '' });
    }
  };

  const filteredFromSuggestions = POPULAR_LOCATIONS.filter((loc) => {
    const matchesInput = loc.toLowerCase().includes((formData.from || '').toLowerCase());
    const notSameAsTo = !formData.to || loc.toLowerCase() !== formData.to.toLowerCase();
    return matchesInput && notSameAsTo;
  });

  const filteredToSuggestions = POPULAR_LOCATIONS.filter((loc) => {
    const matchesInput = loc.toLowerCase().includes((formData.to || '').toLowerCase());
    const notSameAsFrom = !formData.from || loc.toLowerCase() !== formData.from.toLowerCase();
    return matchesInput && notSameAsFrom;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {existingUser ? 'Update Profile' : 'Create Your Profile'}
          </h2>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => {
                  setFormData({ ...formData, age: parseInt(e.target.value) || undefined });
                  if (errors.age) setErrors({ ...errors, age: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                  errors.age ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="25"
                min="18"
                max="100"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => {
                  setFormData({ ...formData, gender: e.target.value });
                  if (errors.gender) setErrors({ ...errors, gender: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                  errors.gender ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.from}
                onChange={(e) => {
                  setFormData({ ...formData, from: e.target.value });
                  setShowFromSuggestions(true);
                  if (errors.from) setErrors({ ...errors, from: '' });
                }}
                onFocus={() => {
                  setShowFromSuggestions(true);
                  setShowToSuggestions(false);
                }}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                  errors.from ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter starting location"
              />
              {showFromSuggestions && filteredFromSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredFromSuggestions.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, from: location });
                        setShowFromSuggestions(false);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.to}
                onChange={(e) => {
                  setFormData({ ...formData, to: e.target.value });
                  setShowToSuggestions(true);
                  if (errors.to) setErrors({ ...errors, to: '' });
                }}
                onFocus={() => {
                  setShowToSuggestions(true);
                  setShowFromSuggestions(false);
                }}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                  errors.to ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter destination"
              />
              {showToSuggestions && filteredToSuggestions.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredToSuggestions.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, to: location });
                        setShowToSuggestions(false);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commute Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.commuteTime}
                  onChange={(e) => {
                    setFormData({ ...formData, commuteTime: e.target.value });
                    if (errors.commuteTime) setErrors({ ...errors, commuteTime: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                    errors.commuteTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="8:00 AM"
                />
              </div>
              {errors.commuteTime && <p className="mt-1 text-sm text-red-600">{errors.commuteTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Distance <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.routeDistance}
                  onChange={(e) => {
                    setFormData({ ...formData, routeDistance: e.target.value });
                    if (errors.routeDistance) setErrors({ ...errors, routeDistance: '' });
                  }}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                    errors.routeDistance ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="25 km"
                />
              </div>
              {errors.routeDistance && <p className="mt-1 text-sm text-red-600">{errors.routeDistance}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                setFormData({ ...formData, bio: e.target.value });
                if (errors.bio) setErrors({ ...errors, bio: '' });
              }}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white ${
                errors.bio ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests <span className="text-red-500">*</span>
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests?.includes(interest) || false}
                      onChange={() => handleInterestToggle(interest)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-900">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            {errors.interests && <p className="mt-1 text-sm text-red-600">{errors.interests}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Gender for Connections
            </label>
            <select
              value={formData.preferredGender}
              onChange={(e) => setFormData({ ...formData, preferredGender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified || false}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Verified Account</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {existingUser ? 'Cancel' : 'Skip for Now'}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {existingUser ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

