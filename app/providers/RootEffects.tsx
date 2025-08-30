// app/providers/RootEffects.tsx
import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from 'react-query';

/**
 * 앱 전역 사이드이펙트:
 * - AppState → react-query focusManager 연결
 * - NetInfo → react-query onlineManager 연결
 */
const RootEffects: React.FC = () => {
  React.useEffect(() => {
    // 포커스 연결
    const detachFocus = focusManager.setEventListener((handleFocus) => {
      const sub = AppState.addEventListener('change', (s: AppStateStatus) => {
        handleFocus(s === 'active');
      });
      return () => sub.remove();
    });

    // 온라인 상태 연결
    const netUnsub = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });

    return () => {
      detachFocus?.();
      netUnsub();
    };
  }, []);

  return null;
};

export default RootEffects;
