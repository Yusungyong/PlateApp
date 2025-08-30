import { useState, useCallback } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { Region } from 'react-native-maps';
import type { RefObject } from 'react';
import type MapView from 'react-native-maps';

type Location = {
  latitude: number;
  longitude: number;
};

const DEFAULT_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.9780,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const useMapLocation = (
  initialRegion: Region = DEFAULT_REGION,
  mapRef?: RefObject<MapView>,
  onRegionChanged?: (region: Region) => void // 👈 콜백 추가
) => {
  const [mapCenter, setMapCenter] = useState<Location>({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });
  const [mapDelta, setMapDelta] = useState<number>(initialRegion.latitudeDelta);
  const [fillColor, setFillColor] = useState<string>('rgba(0,122,255,0.25)');
  const [locationError, setLocationError] = useState<string | null>(null);

  const triggerRadiusBlink = useCallback(() => {
    setFillColor('rgba(0,122,255,0.02)');
    setTimeout(() => {
      setFillColor('rgba(0,122,255,0.25)');
    }, 300);
  }, []);

  const requestUserLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        setMapCenter({ latitude, longitude });
        setMapDelta(0.02);
        setLocationError(null);

        if (onRegionChanged) onRegionChanged(region); // 👈 여기!
        if (mapRef?.current) {
          mapRef.current.animateToRegion(region, 500);
        }
      },
      (error) => {
        console.log('📍 위치 요청 실패:', error.message);
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, [mapRef, onRegionChanged]);

  const setRegionManually = useCallback((region: Region) => {
    setMapCenter({ latitude: region.latitude, longitude: region.longitude });
    setMapDelta(region.latitudeDelta);
    if (onRegionChanged) onRegionChanged(region); // 👈 여기!
  }, [onRegionChanged]);

  return {
    mapCenter,
    mapDelta,
    fillColor,
    setRegionManually,
    requestUserLocation,
    triggerRadiusBlink,
    locationError,
  };
};

export default useMapLocation;
