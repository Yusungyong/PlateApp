// appComponents/LocationGuard.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAndFetchLocation } from '../../common/locationUtils';
import HomeScreen from './HomeScreen';
import { getGuestToken } from '../../auth/hooks/useGuestToken';
import { useAuth } from '../../auth/AuthProvider';
import secureStorage from '../../services/storage/secureStorage';
import { isTokenExpired } from '../../common/jwtUtils';

const LocationGuard = () => {
  const [locationChecked, setLocationChecked] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [guestReady, setGuestReady] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const tokens = await secureStorage.getItem<{ accessToken?: string; refreshToken?: string; deviceId?: string }>('tokens');
        await requestAndFetchLocation(() => {}, setLocationError);

        let accessToken = tokens?.accessToken;
        const refreshToken = tokens?.refreshToken;

        if (!accessToken || isTokenExpired(accessToken)) {
          if (refreshToken && !isTokenExpired(refreshToken)) {
            if (login) await login(accessToken ?? '', refreshToken);
          } else {
            await secureStorage.removeItem('tokens');
            await AsyncStorage.multiRemove(['Authorization', 'username', 'role', 'profileImageUrl', 'region']);
            await logout();
          }
        }

        const finalTokens = await secureStorage.getItem<{ accessToken?: string }>('tokens');
        const finalAccessToken = finalTokens?.accessToken;
        const orgToken = await AsyncStorage.getItem('Authorization');

        if ((!isLoggedIn && !orgToken) || !finalAccessToken) {
          const { token, username } = await getGuestToken();
          if (token && username) {
            await AsyncStorage.setItem('Authorization', token);
            await AsyncStorage.setItem('username', username);
            await login(token);
          }
        }

        setGuestReady(true);
      } catch (err) {
        console.error('초기화 실패:', err);
      } finally {
        setLocationChecked(true);
      }
    };

    init();
  }, [isLoggedIn]);

  if (!locationChecked || !guestReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f80ed" />
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return <HomeScreen />;
};

export default LocationGuard;

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16 },
});
