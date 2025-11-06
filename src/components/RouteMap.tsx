'use client';

import { MapPin } from 'lucide-react';

interface RouteMapProps {
  from: string;
  to: string;
}

export default function RouteMap({ from, to }: RouteMapProps) {
  // Simplified map view - in a real app, you'd integrate Google Maps or Leaflet
  // For now, we'll show a visual representation
  return (
    <div className="bg-gray-100 rounded-xl p-6 h-64 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20"></div>
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">{from}</p>
          </div>
          <div className="text-2xl text-gray-600">→</div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <MapPin className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">{to}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Route visualization (Map integration coming soon)
        </p>
      </div>
    </div>
  );
}
