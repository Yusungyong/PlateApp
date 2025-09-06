import { useState, useCallback } from 'react';
import { Region } from 'react-native-maps';
import type { RefObject } from 'react';
import type MapView from 'react-native-maps';
import { requestAndFetchLocation, type LatLng } from '../../common/locationUtils';

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
  onRegionChanged?: (region: Region) => void
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
    setTimeout(() => setFillColor('rgba(0,122,255,0.25)'), 300);
  }, []);

  // ✅ 유틸 사용: 권한요청 + 위치조회 + 맵 이동
  const requestUserLocation = useCallback(async () => {
    await requestAndFetchLocation(
      // success
      (loc: LatLng) => {
        const region: Region = {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setMapCenter({ latitude: loc.latitude, longitude: loc.longitude });
        setMapDelta(0.02);
        setLocationError(null);
        onRegionChanged?.(region);
        mapRef?.current?.animateToRegion(region, 700);
      },
      // error
      (msg: string) => {
        setLocationError(msg);
      }
    );
  }, [mapRef, onRegionChanged]);

  const setRegionManually = useCallback(
    (region: Region) => {
      setMapCenter({ latitude: region.latitude, longitude: region.longitude });
      setMapDelta(region.latitudeDelta);
      onRegionChanged?.(region);
    },
    [onRegionChanged]
  );

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
