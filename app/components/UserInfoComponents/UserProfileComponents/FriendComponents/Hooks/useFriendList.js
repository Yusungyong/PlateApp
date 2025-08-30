import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../auth/apiService';

export const useFriendList = () => {
  const { apiCall } = useApiService();
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFriendList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) {
        throw new Error('사용자 이름을 찾을 수 없습니다.');
      }
      const response = await apiCall({
        method: 'POST',
        url: '/user-friend-list2',
        data: { username: storedUsername },
      });
      setFriendList(response);
    } catch (err) {
      console.error('Error fetching friend list:', err);
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  return { friendList, loading, error, refetch: fetchFriendList };
};
