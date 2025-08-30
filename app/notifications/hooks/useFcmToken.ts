// appComponents/useFcmToken.ts
import { useCallback, useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

type SaveFn = (p: { username: string; fcmToken: string }) => Promise<any>;

export const useFcmToken = () => {
  const inFlightRef = useRef(false);
  console.log('useFcmToken initialized');

  const registerFcmToken = useCallback(
    async (username?: string | null, saveFcmToken?: SaveFn) => {
      if (!username || !saveFcmToken) return;
      if (inFlightRef.current) return; // 중복 실행 방지

      inFlightRef.current = true;
      try {
        // iOS 권한 요청
        if (Platform.OS === 'ios') {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (!enabled) return;
        }

        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        if (!token) {
          console.warn('FCM 토큰이 없습니다');
          return;
        }

        // ✅ 서버 저장 (중복 여부는 서버에서 처리)
        await saveFcmToken({ username, fcmToken: token });

        if (__DEV__) console.log('✅ FCM 토큰 서버 저장 요청 완료:', token);
      } catch (err) {
        console.error('🚨 FCM 등록 오류:', err);
      } finally {
        inFlightRef.current = false;
      }
    },
    [],
  );

  return { registerFcmToken };
};
