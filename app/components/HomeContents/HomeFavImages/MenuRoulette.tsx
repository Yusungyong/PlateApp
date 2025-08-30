import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useApiService } from '../../../services/api/apiService';

interface MenuItem {
  id: string;
  name: string;
  type: 'video' | 'image' | string;
  placeId?: string; // optional for feed type
}

interface Location {
  latitude: number;
  longitude: number;
}

const MenuRoulette: React.FC = () => {
  const { apiCall } = useApiService();
  const navigation = useNavigation();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [storeId, setStoreId] = useState<string | null>(null);
  const [feedId, setFeedId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const spinTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimer.current) {
        clearTimeout(spinTimer.current);
      }
    };
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    setLocationError(null);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '주변 메뉴 추천을 위해 위치 접근 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationError('위치 접근 권한이 필요합니다.');
          setLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);
        },
        (err) => {
          if (err.code === 1) setLocationError('위치 권한이 거부되었습니다.');
          else if (err.code === 2) setLocationError('위치 정보를 찾을 수 없습니다.');
          else if (err.code === 3) setLocationError('위치 요청 시간이 초과되었습니다.');
          else setLocationError('위치 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      setLocationError('위치 권한 요청 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchMenus = async () => {
      try {
        const response = await apiCall<MenuItem[]>({
          method: 'POST',
          url: 'get-menu-choose-list',
          data: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });

        const uniqueMenus = Array.from(
          new Map(response.map((item) => [item.name, item])).values()
        );

        if (uniqueMenus.length > 0) {
          setMenus(uniqueMenus);
          setCurrentIndex(Math.floor(Math.random() * uniqueMenus.length));
        } else {
          setError('추천 가능한 메뉴가 없습니다.');
        }
      } catch (err: any) {
        setError(err.message || '메뉴 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [location]);

  const getCurrentMenu = () => {
    return menus[currentIndex] ? menus[currentIndex].name : '메뉴 없음';
  };

  const handleResultPress = () => {
    if (!selectedMenu) return;
    if (storeId && storeId !== "0") {
      navigation.navigate('재생', { storeId });
    } else if (feedId && feedId !== "0") {
      navigation.navigate('HomeFeed', { placeId: selectedMenu.placeId });
    }
  };

  const spinRoulette = () => {
    if (isSpinning || menus.length === 0) return;

    setIsSpinning(true);
    setSelectedMenu(null);
    setShowResult(false);

    let delay = 30;
    let spinCount = 0;
    let index = currentIndex;

    const spin = () => {
      spinCount++;
      index = (index + 1) % menus.length;
      setCurrentIndex(index);
      delay *= 1.05;

      if (spinCount > 60 || delay > 60) {
        setIsSpinning(false);
        const finalMenu = menus[index];
        setSelectedMenu(finalMenu);

        if (finalMenu.type === 'video') {
          setStoreId(finalMenu.id);
          setFeedId(null);
        } else if (finalMenu.type === 'image') {
          setFeedId(finalMenu.id);
          setStoreId(null);
        }
        setShowResult(true);
        return;
      }

      spinTimer.current = setTimeout(spin, delay);
    };

    spin();
  };

  const handleRefresh = () => {
    fetchLocation();
  };

  return (
    <View style={styles.wrapper}>
      {/* 안내 메시지 */}
      {(locationError || error) && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ⚠️ {locationError || error}
            {"\n"}정확한 추천을 위해 위치 권한을 허용해 주세요.
          </Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="small" color="#FF7F50" style={{ marginBottom: 10 }} />
      )}

      <View style={styles.compactCard}>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh-outline" size={20} color="#555" />
        </TouchableOpacity>

        <View style={styles.rouletteField}>
          {showResult && selectedMenu ? (
            <TouchableOpacity onPress={handleResultPress}>
              <Animatable.Text animation="bounceIn" duration={800} style={styles.resultText}>
                {selectedMenu.name}
              </Animatable.Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.spinningText}>{getCurrentMenu()}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.buttonMini, isSpinning && styles.disabledButton]}
          onPress={spinRoulette}
          disabled={isSpinning || menus.length === 0}
        >
          {isSpinning ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Icon name="dice-outline" size={18} color="#fff" />
          )}
          <Text style={styles.buttonMiniText}>
            {isSpinning ? '돌리는 중' : '랜덤 추천'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    width: '95%',
    maxWidth: 380,
    justifyContent: 'space-between',
  },
  refreshButton: {
    marginRight: 10,
  },
  rouletteField: {
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinningText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E67E22',
    textAlign: 'center',
  },
  buttonMini: {
    flexDirection: 'row',
    backgroundColor: '#FF7F50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  buttonMiniText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  disabledButton: {
    backgroundColor: '#FFA07A',
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: '95%',
    maxWidth: 380,
  },
  infoText: {
    color: '#E67E22',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#FF7F50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default MenuRoulette;
