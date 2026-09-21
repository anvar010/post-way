"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { liveIcon, pinIcon, DEFAULT_CENTER } from "@/lib/mapIcons";

export default function HomeMap({ position, pins, onPinClick, recenterToken }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const liveMarkerRef = useRef(null);
  const pinMarkersRef = useRef(new Map());
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (mapRef.current || !elRef.current) return;
    const map = L.map(elRef.current, { zoomControl: false }).setView(DEFAULT_CENTER, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    L.control.zoom({ position: "bottomleft" }).addTo(map);
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
    if (!map || !position) return;
    const latlng = [position.lat, position.lng];
    if (!liveMarkerRef.current) {
      liveMarkerRef.current = L.marker(latlng, { icon: liveIcon(), interactive: false, zIndexOffset: 500 }).addTo(map);
    } else {
      liveMarkerRef.current.setLatLng(latlng);
    }
    if (!hasCenteredRef.current) {
      map.setView(latlng, 16);
      hasCenteredRef.current = true;
    }
    setTimeout(() => map.invalidateSize(), 60);
  }, [position]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const seen = new Set();
    (pins || []).forEach((pin) => {
      seen.add(pin.id);
      const existing = pinMarkersRef.current.get(pin.id);
      const latlng = [pin.lat, pin.lng];
      if (existing) {
        existing.setLatLng(latlng);
      } else {
        const marker = L.marker(latlng, { icon: pinIcon(pin.color) });
        marker.on("click", () => onPinClick && onPinClick(pin.id));
        marker.addTo(map);
        pinMarkersRef.current.set(pin.id, marker);
      }
    });
    for (const [id, marker] of pinMarkersRef.current.entries()) {
      if (!seen.has(id)) {
        marker.remove();
        pinMarkersRef.current.delete(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position || !recenterToken) return;
    map.setView([position.lat, position.lng], 17, { animate: true });
  }, [recenterToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={elRef} className="map-canvas" role="img" aria-label="Map showing your current location and saved places" />;
}
