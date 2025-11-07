'use client';

import { useEffect, useState } from 'react';
import { getLocationCoordinates, getCenterPoint, calculateZoom, LocationCoordinates } from '@/utils/locations';
import { MapPin } from 'lucide-react';

interface RouteMapProps {
  from: string;
  to: string;
}

export default function RouteMap({ from, to }: RouteMapProps) {
  const [mounted, setMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((mod) => {
        import('leaflet').then((L) => {
          if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);
          }
          setMapComponents({
            MapContainer: mod.MapContainer,
            TileLayer: mod.TileLayer,
            Marker: mod.Marker,
            Popup: mod.Popup,
            Polyline: mod.Polyline,
            useMap: mod.useMap,
            L: L.default,
          });
        });
      });
    }
  }, []);

  const fromCoords = getLocationCoordinates(from);
  const toCoords = getLocationCoordinates(to);

  if (!mounted || !MapComponents || !fromCoords || !toCoords) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, L } = MapComponents;

  const createIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 16px;
            font-weight: bold;
          ">📍</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  const FitBounds = ({ from, to }: { from: LocationCoordinates; to: LocationCoordinates }) => {
    const map = useMap();
    useEffect(() => {
      if (from && to && map) {
        const bounds = L.latLngBounds([from, to]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, from, to]);
    return null;
  };

  const center = getCenterPoint(fromCoords, toCoords);
  const zoom = calculateZoom(fromCoords, toCoords);

  const routePoints: [number, number][] = [
    [fromCoords.lat, fromCoords.lng],
    [(fromCoords.lat + center.lat) / 2, (fromCoords.lng + center.lng) / 2],
    [center.lat, center.lng],
    [(center.lat + toCoords.lat) / 2, (center.lng + toCoords.lng) / 2],
    [toCoords.lat, toCoords.lng],
  ];

  return (
    <div className="rounded-xl overflow-hidden h-96 border border-gray-200 shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds from={fromCoords} to={toCoords} />
        
        <Marker position={[fromCoords.lat, fromCoords.lng]} icon={createIcon('#3b82f6')}>
          <Popup>
            <div className="text-center">
              <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="font-semibold text-gray-900">{from}</p>
              <p className="text-xs text-gray-500">Starting Point</p>
            </div>
          </Popup>
        </Marker>
        
        <Marker position={[toCoords.lat, toCoords.lng]} icon={createIcon('#6366f1')}>
          <Popup>
            <div className="text-center">
              <MapPin className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <p className="font-semibold text-gray-900">{to}</p>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </Popup>
        </Marker>
        
        <Polyline
          positions={routePoints}
          pathOptions={{
            color: '#3b82f6',
            weight: 6,
            opacity: 0.9,
          }}
        />
      </MapContainer>
    </div>
  );
}
