import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { tokenStorage } from '../storage/secureStorage';
import { apiUrl } from '../../config/config';
import { useAuth } from '../../auth/AuthProvider';
import { navigate } from '../../navigation/navigationRef';

const API_URL = apiUrl;

const cache = new Map<string, any>();
const pendingRequests = new Map<string, Promise<any>>();
const sessionAlertShownRefGlobal = { current: false };

type AuthFns = {
  login?: (access: string, refresh?: string | null) => Promise<void>;
  logout?: () => Promise<void>;
};
const authFns: AuthFns = {};
export const setAuthFns = (fns: AuthFns) => {
  if (fns.login) authFns.login = fns.login;
  if (fns.logout) authFns.logout = fns.logout;
};

let apiInstance: AxiosInstance | null = null;
let refreshPromise: Promise<string> | null = null;

// ------- 공용: 새 액세스 토큰 한 번만 갱신 (single-flight) -------
export async function refreshOnce(instance: AxiosInstance): Promise<string> {  // ✅ export
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = await tokenStorage.get();
    const refreshToken = tokens?.refreshToken;
    const deviceId = tokens?.deviceId;
    if (!refreshToken) throw new Error('No refresh token');

    const refreshRes = await instance.post('auth/refresh', { refreshToken, deviceId });
    const payload = refreshRes.data as {
      accessToken: string;
      refreshToken?: string;
      accessTokenExpiresAt?: string;
      refreshTokenExpiresAt?: string;
    };

    const newAccessToken = payload?.accessToken;
    if (!newAccessToken) throw new Error('No access token from refresh');

    const newTokens = {
      ...(tokens ?? {}),
      accessToken: newAccessToken,
      refreshToken: payload.refreshToken ?? tokens?.refreshToken,
      deviceId,
      accessTokenExpiresAt: payload.accessTokenExpiresAt ?? tokens?.accessTokenExpiresAt,
      refreshTokenExpiresAt: payload.refreshTokenExpiresAt ?? tokens?.refreshTokenExpiresAt,
    };
    await tokenStorage.set(newTokens);

    if (authFns.login) {
      await authFns.login(newTokens.accessToken, newTokens.refreshToken ?? null);
    }
    return newAccessToken;
  })().finally(() => {
    refreshPromise = null; // 다음 401에서 다시 새 promise 생성 가능
  });

  return refreshPromise;
}

// ------- 유틸 -------
function isAuthSkipPath(url: string | undefined) {
  if (!url) return false;
  const u = url.toString();
  return (
    u.includes('login') ||
    u.includes('auth/refresh') ||
    u.includes('auth/guest-token')
  );
}

// ------- axios 인스턴스 -------
export function getApiInstance(): AxiosInstance {   // ✅ export
  if (apiInstance) return apiInstance;

  const instance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Request
  instance.interceptors.request.use(
    async (config) => {
      const url = (config.url || '').toString();
      const skipAuth = isAuthSkipPath(url);

      if (!skipAuth) {
        const tokens = await tokenStorage.get();
        const accessToken = tokens?.accessToken;
        if (accessToken) {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${accessToken}`;
        }
      }

      if (config.data instanceof FormData && config.headers?.['Content-Type']) {
        delete (config.headers as any)['Content-Type'];
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const urlPath = (originalRequest?.url || '').toString();
      const status = error.response?.status;

      // refresh 엔드포인트 401
      if (status === 401 && urlPath.includes('auth/refresh')) {
        if (!sessionAlertShownRefGlobal.current) {
          sessionAlertShownRefGlobal.current = true;
          try { if (authFns.logout) await authFns.logout(); }
          finally {
            Alert.alert('세션 만료', '로그인이 만료되었습니다. 다시 로그인해주세요.', [
              { text: '확인', onPress: () => navigate('Login' as any) },
            ]);
            setTimeout(() => { sessionAlertShownRefGlobal.current = false; }, 3000);
          }
        }
        return Promise.reject(error);
      }

      // 일반 API 401 → refreshOnce
      if (status === 401 && !originalRequest._retry && !isAuthSkipPath(urlPath)) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshOnce(instance);
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          };
          return instance(originalRequest);
        } catch (refreshErr) {
          if (!sessionAlertShownRefGlobal.current) {
            sessionAlertShownRefGlobal.current = true;
            try { if (authFns.logout) await authFns.logout(); }
            finally {
              Alert.alert('세션 만료', '로그인이 만료되었습니다. 다시 로그인해주세요.', [
                { text: '확인', onPress: () => navigate('Login' as any) },
              ]);
              setTimeout(() => { sessionAlertShownRefGlobal.current = false; }, 3000);
            }
          }
          return Promise.reject(refreshErr);
        }
      }

      await handleError(error);
      return Promise.reject(error);
    },
  );

  apiInstance = instance;
  return apiInstance;
}

// ------- 공용 에러 핸들러 -------
const handleError = async (error: AxiosError) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401) return; // 상단에서 처리
    const errorMessages: { [key: number]: string } = {
      403: '이 작업을 수행할 권한이 없습니다.',
      404: '요청하신 리소스를 찾을 수 없습니다.',
      500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
    Alert.alert('오류 발생', errorMessages[status] || `문제가 발생했습니다. (에러 코드: ${status})`);
  } else if (error.request) {
    Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다. 인터넷 상태를 확인해주세요.');
  } else {
    Alert.alert('오류', `알 수 없는 오류가 발생했습니다: ${error.message}`);
  }
};

// ------- React 훅 -------
export const useApiService = () => {
  const { login, logout } = useAuth();

  useEffect(() => {
    setAuthFns({ login, logout });
  }, [login, logout]);

  const api = useMemo(() => getApiInstance(), []);

  const apiCall = useCallback(
    async <T,>(config: AxiosRequestConfig): Promise<T> => {
      const sortedParams = config.params
        ? Object.keys(config.params)
            .sort()
            .reduce((acc, key) => {
              (acc as any)[key] = (config.params as any)[key];
              return acc;
            }, {} as Record<string, any>)
        : {};

      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(sortedParams)}:${JSON.stringify(config.data)}`;

      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey) as Promise<T>;
      }

      const request = (async () => {
        const res = await api(config);
        cache.set(cacheKey, res.data);
        return res.data as T;
      })().finally(() => {
        pendingRequests.delete(cacheKey);
      });

      pendingRequests.set(cacheKey, request);
      return request;
    },
    [api],
  );

  const invalidateCache = useCallback((url: string) => {
    for (const key of cache.keys()) {
      if (key.includes(url)) cache.delete(key);
    }
  }, []);

  return { apiCall, invalidateCache };
};
