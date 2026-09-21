"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { pinIcon, DEFAULT_CENTER } from "@/lib/mapIcons";

export default function PreviewMap({ lat, lng, color = "#8E1F2B", className = "map-preview" }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !elRef.current) return;
    const map = L.map(elRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      tap: true,
    }).setView(DEFAULT_CENTER, 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || lat == null || lng == null) return;
    const latlng = [lat, lng];
    map.setView(latlng, 16);
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng, { icon: pinIcon(color), interactive: false }).addTo(map);
    } else {
      markerRef.current.setLatLng(latlng);
      markerRef.current.setIcon(pinIcon(color));
    }
    setTimeout(() => map.invalidateSize(), 80);
  }, [lat, lng, color]);

  return <div ref={elRef} className={className} />;
}
