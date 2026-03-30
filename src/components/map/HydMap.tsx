'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HYDERABAD } from '@/config/constants';
import { useDashboardStore } from '@/lib/store';
import { getAQILevel } from '@/config/constants';

export function HydMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { aqiData, mapVisible } = useDashboardStore();
  const [loaded, setLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const style =
      process.env.NEXT_PUBLIC_MAPLIBRE_STYLE ||
      'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [HYDERABAD.CENTER.lng, HYDERABAD.CENTER.lat],
      zoom: HYDERABAD.ZOOM,
      maxBounds: [
        [HYDERABAD.BOUNDS.west - 0.2, HYDERABAD.BOUNDS.south - 0.2],
        [HYDERABAD.BOUNDS.east + 0.2, HYDERABAD.BOUNDS.north + 0.2],
      ],
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      'top-right'
    );

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    map.current.on('load', () => setLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add AQI markers
  useEffect(() => {
    if (!map.current || !loaded || aqiData.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const station of aqiData) {
      const aqi = station.aqi ?? 0;
      const level = getAQILevel(aqi);

      const el = document.createElement('div');
      el.className = 'aqi-marker';
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${level.color}30;
        border: 2px solid ${level.color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 700;
        color: ${level.color};
        cursor: pointer;
        transition: transform 0.15s;
      `;
      el.textContent = String(aqi || '--');
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popup = new maplibregl.Popup({
        offset: 16,
        closeButton: false,
        maxWidth: '220px',
      }).setHTML(`
        <div style="font-family: system-ui; font-size: 12px; color: #e5e7eb; background: #1f2937; padding: 8px 12px; border-radius: 8px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${station.stationName}</div>
          <div style="color: ${level.color}; font-weight: 700; font-size: 14px;">AQI: ${aqi} (${level.label})</div>
          <div style="color: #9ca3af; margin-top: 4px; font-size: 10px;">
            PM2.5: ${station.pm25 ?? '--'} | PM10: ${station.pm10 ?? '--'}<br/>
            NO2: ${station.no2 ?? '--'} | SO2: ${station.so2 ?? '--'} | O3: ${station.o3 ?? '--'}
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    }
  }, [aqiData, loaded]);

  if (!mapVisible) return null;

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] lg:h-[500px] rounded-lg border border-gray-800 overflow-hidden"
    />
  );
}
