// app/navigation/AppNavigationContainer.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import TokenRefresher from '../auth/TokenRefresher';
import AuthProvider from '../auth/AuthProvider';
import Navigation from './Navigation';
import {
  navigationRef,
  navReady,
  flushPending,
} from './navigationRef';

import AppStatusBar from '../ui/AppStatusBar';
import FcmManager from '../notifications/FcmManager';
import { navigateFromNotification } from '../notifications/navigateFromNotification';

/**
 * NavigationContainer 래퍼
 * - onReady에서 보류 큐 Flush
 * - 알림 클릭(백/종료) 네비게이션 처리
 * - AuthProvider/FcmManager/StatusBar/Navigation 조립
 */
const AppNavigationContainer: React.FC = () => {
  // 알림 클릭 (백그라운드/종료)
  React.useEffect(() => {
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data) {
        if (__DEV__) console.log('📦 알림 클릭(Background):', remoteMessage.data);
        navigateFromNotification(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          if (__DEV__) console.log('📦 알림 클릭(Terminated):', remoteMessage.data);
          navigateFromNotification(remoteMessage);
        }
      });

    return () => unsubscribeOpened();
  }, []);

  const handleForegroundNotification = React.useCallback((_data: any) => {
    // 예: 실시간 갱신 트리거 (필요 시 연결)
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navReady.current = true;
        flushPending();
      }}
    >
      <AuthProvider>
        <AppStatusBar />
        <FcmManager onForegroundNotification={handleForegroundNotification} />
        <TokenRefresher />
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
