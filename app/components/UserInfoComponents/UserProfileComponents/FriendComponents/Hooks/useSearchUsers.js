import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../../services/api/apiService';

const useSearchUsers = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { apiCall } = useApiService();

  const searchUsers = async (searchText) => {
    if (!searchText) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        throw new Error('사용자 이름을 찾을 수 없습니다.');
      }
      const response = await apiCall({
        method: 'POST',
        url: '/user-list', // 새로운 사용자 검색 API 엔드포인트
        data: {
          friendName: searchText,
          username,
        },
      });
      setSearchResults(response);
    } catch (err) {
      console.error('Error searching users:', err);
      const errMsg = err.message || '사용자 검색 중 오류가 발생했습니다.';
      setError(errMsg);
      Alert.alert('오류', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, searchUsers };
};

export default useSearchUsers;
