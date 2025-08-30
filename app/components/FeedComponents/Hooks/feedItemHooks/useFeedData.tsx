import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAndFetchLocation } from '../../../../common/locationUtils';
import { useApiService } from '../../../../services/api/apiService';

interface FeedItem {
  id: string;
  userName: string;
  userProfile: string;
  content: string;
  image?: string;
  time: string;
  likeCount: number;
  likeYn: string;
  activeRegion: string;
  nickName: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export const useFeedData = (feedId?: number, placeId?: string) => {
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // 사용자 위치 상태 추가
  const [location, setLocation] = useState<Location | null>(null);

  const { apiCall } = useApiService();

  const fetchFeedData = async () => {
    setLoading(true);
    setError(null);

    try {
      // AsyncStorage에서 username을 가져옴
      const username = await AsyncStorage.getItem('username');

      if (!username) {
        throw new Error('Username not found in storage.');
      }
      
      // params 객체에 username 기본값을 넣고, location 값이 있다면 추가합니다.
      const params: Record<string, any> = { username };
      if (location) {
        params.latitude = location.latitude;
        params.longitude = location.longitude;
      }
      if (feedId) {
        params.feedId = feedId;
      }
      if (placeId) {
        params.placeId = placeId;
      }
      const response = await apiCall<FeedItem[]>({
        method: 'POST',
        url: '/read-home-feed',
        data : params,
      });

      const formattedData = response.map(item => ({
        ...item,
        likeCount: item.likeCount ?? 0,  // 기본값 설정
        likeYn: item.likeYn ?? 'N',      // 기본값 설정
      }));
      setFeedData(formattedData);
    } catch (err) {
      setError('피드 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 및 location, feedId, placeId 변경 시 피드 데이터를 가져옵니다.
  useEffect(() => {
    fetchFeedData();
  }, [placeId]);

  // 컴포넌트 마운트 시 위치 권한 요청 및 위치 정보 가져오기
  useEffect(() => {
    requestAndFetchLocation(setLocation, setError);
  }, []);

  return { feedData, loading, error, refetch: fetchFeedData };
};
