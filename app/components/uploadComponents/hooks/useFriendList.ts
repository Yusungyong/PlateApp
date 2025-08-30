import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useApiService } from '../../../services/api/apiService';

export const useFriendList = () => {
  const [friendList, setFriendList] = useState([]);
  const { apiCall } = useApiService();

  useEffect(() => {
    const fetch = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        if (!username) throw new Error('사용자 없음');
        const response = await apiCall({
          method: 'POST',
          url: '/user-friend-list2',
          data: { username },
        });
        setFriendList(response);
      } catch (err: any) {
        Alert.alert('친구 목록 오류', err.message);
      }
    };
    fetch();
  }, []);

  return friendList;
};
