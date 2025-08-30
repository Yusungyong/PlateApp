import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { tokenStorage } from '../services/storage/secureStorage';
import { refreshOnce, getApiInstance } from '../services/api/apiService'; // ✅ 통합 import

type Timer = ReturnType<typeof setTimeout>;

const TokenRefresher: React.FC = () => {
  const timerRef = useRef<Timer | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedule = async () => {
    clearTimer();
    const tokens = await tokenStorage.get();
    const exp = tokens?.accessTokenExpiresAt ? new Date(tokens.accessTokenExpiresAt).getTime() : 0;
    if (!tokens?.refreshToken || !tokens?.deviceId || !exp) return;

    const msLeft = exp - Date.now();
    const fireIn = Math.max(0, msLeft - 60_000); // 만료 60초 전
    timerRef.current = setTimeout(() => void doRefresh(), fireIn);
  };

  const doRefresh = async () => {
    try {
      const instance = getApiInstance();
      await refreshOnce(instance);   // ✅ 여기서만 refresh
    } finally {
      await schedule();              // ✅ 다음 주기 다시 예약
    }
  };

  useEffect(() => {
    schedule();

    const handler = (state: AppStateStatus) => {
      if (state === 'active') schedule();
    };
    const sub = AppState.addEventListener('change', handler);

    return () => {
      clearTimer();
      sub.remove();
    };
  }, []);

  return null;
};

export default TokenRefresher;
