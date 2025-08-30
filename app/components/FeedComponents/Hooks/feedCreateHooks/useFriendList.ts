import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../services/api/apiService';

export const useFriendList = () => {
  const [friendList, setFriendList] = useState([]);
  const { apiCall } = useApiService();

  const fetchFriendList = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) throw new Error('사용자 이름 없음');
      const response = await apiCall({ method: 'POST', url: '/user-friend-list2', data: { username } });
      setFriendList(response);
    } catch (e) {
      console.error('친구 목록 조회 실패', e);
    }
  }, []);

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  return friendList;
};
