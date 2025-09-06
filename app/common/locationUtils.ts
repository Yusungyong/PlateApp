import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export type LatLng = { latitude: number; longitude: number };
type Setter<T> = (v: T) => void;

// ANDROID: 권한 요청 (정밀/대략 중 하나만 허용돼도 통과)
async function requestAndroidLocationPermission(): Promise<boolean> {
  const fine = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  const coarse = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
  );
  if (fine || coarse) return true;

  const res = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);

  const grantedFine =
    res[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
    PermissionsAndroid.RESULTS.GRANTED;
  const grantedCoarse =
    res[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
    PermissionsAndroid.RESULTS.GRANTED;

  return grantedFine || grantedCoarse;
}

// iOS: 권한 요청
async function requestIOSLocationPermission(): Promise<boolean> {
  const auth = await Geolocation.requestAuthorization('whenInUse'); // 배경 필요하면 'always'
  return auth === 'granted';
}

// 콜백 API를 Promise로 래핑
function getPosition(options: Parameters<typeof Geolocation.getCurrentPosition>[2]) {
  return new Promise<LatLng>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      err => reject(err),
      options
    );
  });
}

export const requestAndFetchLocation = async (
  setLocation: Setter<LatLng>,
  setError: Setter<string>
) => {
  try {
    const hasPermission =
      Platform.OS === 'android'
        ? await requestAndroidLocationPermission()
        : await requestIOSLocationPermission();

    if (!hasPermission) {
      setError('위치 권한이 거부되었습니다.');
      return;
    }

    // 1차: 고정밀 시도
    try {
      const loc = await getPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        // Android 옵션
        forceRequestLocation: true,
        showLocationDialog: true,
      });
      setLocation(loc);
      return;
    } catch (err: any) {
      // 2차: 저정밀 빠른 조회(타임아웃/비가용만 대상)
      if (err?.code === 3 /* TIMEOUT */ || err?.code === 2 /* POSITION_UNAVAILABLE */) {
        try {
          const loc = await getPosition({
            enableHighAccuracy: false,
            timeout: 7000,
            maximumAge: 30000,
            forceRequestLocation: true,
            showLocationDialog: true,
          });
          setLocation(loc);
          return;
        } catch (err2: any) {
          console.warn('getCurrentPosition fallback error:', err2);
          setError(
            err2?.code === 3
              ? '위치 조회 시간이 초과되었습니다.'
              : '위치 정보를 가져올 수 없습니다.'
          );
          return;
        }
      }

      console.warn('getCurrentPosition error:', err);
      setError(
        err?.code === 1
          ? '위치 권한이 거부되었습니다.'
          : '위치 정보를 가져오는 중 오류가 발생했습니다.'
      );
    }
  } catch (e) {
    console.error('location error:', e);
    setError('위치 권한 요청 중 오류가 발생했습니다.');
  }
};
