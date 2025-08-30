// app/notifications/FcmManager.tsx
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSaveFcmToken } from './hooks/useSaveFcmToken';
import { useFcmToken } from './hooks/useFcmToken';
import { useAuth } from '../auth/AuthProvider';

/**
 * FCM 포어그라운드 수신 + 토큰 등록 트리거
 * - 함수 아이덴티티 안정화를 위해 useRef로 래핑
 */
const FcmManager: React.FC<{ onForegroundNotification?: (data: any) => void }> = ({
  onForegroundNotification,
}) => {
  const { saveFcmToken } = useSaveFcmToken();
  const { registerFcmToken } = useFcmToken();
  const auth = useAuth() as any;

  const isLoggedIn: boolean = !!auth?.isLoggedIn;
  const username: string | undefined = auth?.user?.username ?? auth?.username ?? undefined;

  const saveRef = React.useRef(saveFcmToken);
  React.useEffect(() => {
    saveRef.current = saveFcmToken;
  }, [saveFcmToken]);

  const registerRef = React.useRef(registerFcmToken);
  React.useEffect(() => {
    console.log('✅ FcmManager: registerFcmToken 업데이트',auth);
    registerRef.current = registerFcmToken;
  }, [registerFcmToken]);

  React.useEffect(() => {
    if (!isLoggedIn || !username) return;

    // 내부에서 아이템포턴트/중복 실행 방지 처리
    registerRef
      .current(username, (p) => saveRef.current(p))
      .catch((err) => console.error('🚨 FCM 설정 오류:', err));

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (__DEV__) console.log('📦 Foreground FCM payload:', remoteMessage.data);
      onForegroundNotification?.(remoteMessage.data);
    });

    return unsubscribe;
  }, [isLoggedIn, username, onForegroundNotification]);

  return null;
};

export default FcmManager;
