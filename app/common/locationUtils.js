import Geolocation from 'react-native-geolocation-service';

export const requestAndFetchLocation = async (setLocation, setError) => {
  try {
    // iOS 권한 요청
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    if (authStatus === 'granted') {
      // 위치 가져오기
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('위치 정보 가져오기 오류:', error);
          setError('위치 정보를 가져오는 중 오류가 발생했습니다.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setError('');
    }
  } catch (err) {
    console.error('위치 권한 요청 중 오류:', err);
    setError('위치 권한 요청 중 오류가 발생했습니다.');
  }
};
