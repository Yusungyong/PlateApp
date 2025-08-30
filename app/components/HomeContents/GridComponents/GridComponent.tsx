// GridComponent.tsx (기능 개선 버전)
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';
import ChatResponseCluster from './ChatResponseCluster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedImageBucket, imageBucket } from '../../../config/config';
import { useApiService } from '../../../services/api/apiService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - 48) / 3;

const categoryData = [
  { label: '저녁', image: require('../../../../../images/image_1.png'), onPressMessage: '저녁' },
  { label: '점심', image: require('../../../../../images/image_2.png'), onPressMessage: '점심' },
  { label: '회식', image: require('../../../../../images/image_3.png'), onPressMessage: '회식' },
  { label: '술안주', image: require('../../../../../images/image_4.png'), onPressMessage: '술안주' },
  { label: '카페', image: require('../../../../../images/image_5.png'), onPressMessage: '카페&디저트' },
  { label: '포장&배달', image: require('../../../../../images/image_6.png'), onPressMessage: '포장&배달' },
];

type Suggestion = {
  id: string;
  imageUrl: string;
  title?: string;
  storeName?: string;
  distance?: string;
};

const GridComponent = () => {
  const { apiCall } = useApiService();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showCluster, setShowCluster] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const cardRefs = useRef<Animatable.View[]>([]);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('위치 권한 거부됨', '위치 권한이 있어야 AI 추천을 받을 수 있어요.');
            return;
          }
        }
        Geolocation.getCurrentPosition(
          ({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude }),
          (error) => {
            console.error('위치 오류:', error);
            Alert.alert('위치 조회 실패', '현재 위치를 불러오지 못했어요.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.error(err);
      }
    };
    requestLocation();
  }, []);

  const handlePress = async (message: string, ref: Animatable.View) => {
    if (loading) return; // 중복 요청 방지
    if (!location.latitude || !location.longitude) {
      Alert.alert('위치 정보 없음', '현재 위치를 불러올 수 없습니다.');
      return;
    }

    if (ref) ref.bounceIn(400);
    setLoading(true);
    try {
      const username = await AsyncStorage.getItem('username');
      const response = await apiCall({
        method: 'POST',
        url: 'get-suggestion-data',
        data: {
          message,
          username,
          userLatitude: location.latitude,
          userLongitude: location.longitude,
        },
      });
      
      const list: Suggestion[] = response.map((item: any) => {
        const baseUrl = item.type === 'video' ? imageBucket : FeedImageBucket;
        return {
          id: item.id,
          imageUrl: `${baseUrl}${item.image}`,
          title: item.reason,
          storeName: item.storeName,
          distance: item.distanceStr,
        };
      });

      setSuggestions(list);
      setShowCluster(true);
    } catch (error) {
      console.error('API 호출 에러:', error);
      Alert.alert('서버 오류', '추천 데이터를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>추천메뉴</Text>

      <View style={styles.gridContainer}>
        {categoryData.map((item, index) => (
          <Animatable.View
            key={index}
            ref={(r) => r && (cardRefs.current[index] = r)}
            animation="fadeInUp"
            duration={600}
            delay={index * 100}
            style={styles.itemWrapper}
          >
            <TouchableOpacity
              onPress={() => handlePress(item.onPressMessage, cardRefs.current[index])}
              activeOpacity={0.9}
              style={styles.card}
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      <ChatResponseCluster
        visible={showCluster}
        onClose={() => setShowCluster(false)}
        suggestions={suggestions}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff7f50" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    color: '#222',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  itemWrapper: {
    width: ITEM_WIDTH,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  label: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GridComponent;
