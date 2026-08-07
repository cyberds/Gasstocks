'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon using the 3D logo
const icon = L.icon({
  iconUrl: '/assets/Gasstocks-map-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Helper component to smoothly recenter map when position changes
function MapRecenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15, { duration: 1.5 });
  }, [position, map]);
  return null;
}

interface ContactMapProps {
  position: [number, number];
  address: string;
}

export default function ContactMap({ position, address }: ContactMapProps) {
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px', position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '8px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}>
              {address}
            </div>
          </Popup>
        </Marker>
        <MapRecenter position={position} />
      </MapContainer>
    </div>
  );
}
