// auth/AuthProvider.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { tokenStorage } from '../services/storage/secureStorage';
import { apiUrl } from '../config/config';
import { getGuestToken } from './hooks/useGuestToken';  // ✅ 추가

interface AuthContextType {
  isLoggedIn: boolean;     // 실제 로그인 여부
  isInitializing: boolean; // 초기화중 여부
  token: string | null;
  role: string | null;
  username: string | null;
  login: (token: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  initialToken?: string | null;
  children: React.ReactNode;
}

type JwtPayload = { role?: string; username?: string };

const decodeFromToken = (token: string): { role: string | null; username: string | null } => {
  try {
    const raw = token.replace(/^Bearer\s+/i, '').trim();
    if (!raw || raw.split('.').length !== 3) return { role: null, username: null };
    const decoded = jwtDecode<JwtPayload>(raw);
    return { role: decoded?.role ?? null, username: decoded?.username ?? null };
  } catch {
    return { role: null, username: null };
  }
};

const API_BASE = apiUrl.replace(/\/+$/, '');

export const AuthProvider: React.FC<AuthProviderProps> = ({ initialToken, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // ✅ 초기화 (앱 시작 시)
  useEffect(() => {
    const initialize = async () => {
      try {
        const tokens = await tokenStorage.get();
        const storedToken = initialToken ?? tokens?.accessToken ?? null;

        if (storedToken) {
          // 토큰 있으면 → decode
          const { role: decodedRole, username: decodedUser } = decodeFromToken(storedToken);
          if (!decodedRole || decodedRole === 'guest') {
            setToken(storedToken);
            setIsLoggedIn(false);
            setRole('guest');
            setUsername(decodedUser ?? 'guest');
          } else {
            setToken(storedToken);
            setIsLoggedIn(true);
            setRole(decodedRole);
            setUsername(decodedUser);
          }
        } else {
          // ✅ 토큰 없으면 게스트 로그인 자동 실행
          const { token: guestToken, username: guestName } = await getGuestToken();
          if (guestToken) {
            await tokenStorage.set({ accessToken: guestToken });
            setToken(guestToken);
            setIsLoggedIn(false);
            setRole('guest');
            setUsername(guestName ?? 'guest');
          }
        }
      } finally {
        setIsInitializing(false);
      }
    };
    initialize();
  }, [initialToken]);

  // ✅ 로그인 (실제 계정 로그인)
  const login = async (newToken: string, newRefreshToken?: string) => {
    const prev = await tokenStorage.get();
    const useRefreshToken = newRefreshToken !== undefined ? newRefreshToken : prev?.refreshToken ?? '';
    const deviceId = prev?.deviceId;
    const { role: decodedRole, username: decodedUser } = decodeFromToken(newToken);

    await tokenStorage.set({
      accessToken: newToken,
      refreshToken: useRefreshToken,
      deviceId,
      username: decodedUser,
      accessTokenExpiresAt: prev?.accessTokenExpiresAt,
      refreshTokenExpiresAt: prev?.refreshTokenExpiresAt,
      role: decodedRole ?? prev?.role,
    });

    if (!decodedRole || decodedRole === 'guest') {
      setToken(newToken);
      setIsLoggedIn(false);
      setRole('guest');
      setUsername(decodedUser ?? 'guest');
    } else {
      setToken(newToken);
      setIsLoggedIn(true);
      setRole(decodedRole);
      setUsername(decodedUser);
    }
  };

  // ✅ 로그아웃 (다시 게스트 로그인으로 전환)
  const logout = async () => {
    const tokens = await tokenStorage.get();
    const deviceId = tokens?.deviceId;
    const accessToken = tokens?.accessToken;

    try {
      if (accessToken) {
        await axios.post(
          `${API_BASE}/auth/logout`,
          { deviceId, allDevices: false },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch {
      // best-effort
    }

    await tokenStorage.clear();
    if (deviceId) await tokenStorage.set({ deviceId });
    await AsyncStorage.multiRemove(['username', 'role', 'profileImageUrl', 'region']);

    // ✅ 게스트 토큰 새로 발급
    const { token: guestToken, username: guestName } = await getGuestToken();
    if (guestToken) {
      await tokenStorage.set({ accessToken: guestToken });
      setToken(guestToken);
      setIsLoggedIn(false);
      setRole('guest');
      setUsername(guestName ?? 'guest');
    } else {
      setToken(null);
      setIsLoggedIn(false);
      setRole(null);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isInitializing, token, role, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
