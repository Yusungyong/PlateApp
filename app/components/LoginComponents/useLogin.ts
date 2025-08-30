// hooks/useLogin.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { tokenStorage } from '../../services/storage/secureStorage';
import { useApiService } from '../../services/api/apiService';

export const useLogin = (loginCallback: (accessToken: string, refreshToken?: string) => Promise<void>) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { apiCall } = useApiService();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('오류', '아이디와 비밀번호를 모두 입력해주세요');
      return;
    }

    const deviceModel = DeviceInfo.getModel();
    const os = DeviceInfo.getSystemName(); // 서버와 동일 표기
    const osVersion = DeviceInfo.getSystemVersion();
    const appVersion = DeviceInfo.getVersion();
    const deviceId = await DeviceInfo.getUniqueId();

    try {
      const data = await apiCall<any>({
        url: 'login',
        method: 'POST',
        data: {
          username,
          password,
          deviceModel,
          os,
          osVersion,
          appVersion,
          deviceId,
        },
      });

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        username: respUsername,
        role,
      } = data || {};

      if (accessToken && refreshToken) {
        // 토큰/만료/유저정보 저장
        await tokenStorage.set({
          accessToken,
          refreshToken,
          deviceId,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
          username: respUsername ?? username,
          role,
        });

        // Auth 컨텍스트 갱신
        await loginCallback(accessToken, refreshToken);

        // 유저 상세 정보 갱신
        await fetchUserInfo(respUsername ?? username);
      } else {
        Alert.alert('오류', '토큰을 가져올 수 없습니다.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      Alert.alert('오류', serverMsg || '로그인 중 오류가 발생했습니다');
    }
  };

  const fetchUserInfo = async (uname: string) => {
    try {
      const tokens = await tokenStorage.get();
      const accessToken = tokens?.accessToken;
      if (!accessToken) {
        Alert.alert('오류', '토큰이 유실되었습니다. 다시 로그인해주세요.');
        return;
      }

      const userInfoData = await apiCall<any>({
        url: 'userInfo2',
        method: 'POST',
        data: { username: uname },
      });

      if (userInfoData?.username) {
        await AsyncStorage.setItem('username', userInfoData.username);
      }
      if (userInfoData?.role) {
        await AsyncStorage.setItem('role', userInfoData.role);
      }
      if (userInfoData?.profileImageUrl) {
        await AsyncStorage.setItem('profileImageUrl', userInfoData.profileImageUrl);
      }
      if (userInfoData?.region) {
        await AsyncStorage.setItem('region', userInfoData.region);
      }
    } catch (error: any) {
      console.error('Fetch user info error:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      Alert.alert('오류', msg || '사용자 정보를 불러오는 중 오류가 발생했습니다');
    }
  };

  return { username, setUsername, password, setPassword, handleLogin };
};
