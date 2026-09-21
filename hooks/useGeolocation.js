"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reverseGeocode } from "@/lib/geocode";

export function useGeolocation() {
  const [status, setStatus] = useState("loading"); // loading | prompt | ready | denied | error
  const [errorDetail, setErrorDetail] = useState("");
  const [permissionState, setPermissionState] = useState("unknown");
  const [position, setPosition] = useState(null); // { lat, lng, accuracy }
  const [address, setAddress] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const geocodeRequestId = useRef(0);

  const handleSuccess = useCallback((pos) => {
    const { latitude, longitude, accuracy } = pos.coords;
    setPosition({ lat: latitude, lng: longitude, accuracy });
    setPermissionState("granted");
    setStatus("ready");
    setUpdatedAt(Date.now());
    setAddress(null);

    const requestId = ++geocodeRequestId.current;
    reverseGeocode(latitude, longitude).then((addr) => {
      if (geocodeRequestId.current === requestId) setAddress(addr);
    });
  }, []);

  const handleError = useCallback((err) => {
    if (err && err.code === 1) {
      setPermissionState("denied");
      setStatus("denied");
    } else if (err && err.code === 3) {
      setStatus("error");
      setErrorDetail("Location request timed out. Try again in an open area.");
    } else {
      setStatus("error");
      setErrorDetail("Something went wrong finding your location.");
    }
  }, []);

  const request = useCallback(() => {
    setStatus("loading");
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorDetail("Geolocation isn't supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 15000,
    });
  }, [handleSuccess, handleError]);

  useEffect(() => {
    let permissionStatusRef;
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permStatus) => {
          permissionStatusRef = permStatus;
          setPermissionState(permStatus.state);
          if (permStatus.state === "denied") {
            setStatus("denied");
          } else {
            request();
          }
          permStatus.onchange = () => setPermissionState(permStatus.state);
        })
        .catch(() => request());
    } else {
      request();
    }
    return () => {
      if (permissionStatusRef) permissionStatusRef.onchange = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, errorDetail, permissionState, position, address, updatedAt, request };
}
