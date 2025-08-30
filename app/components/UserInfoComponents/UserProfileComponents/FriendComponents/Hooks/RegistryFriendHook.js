// RegistryFriendHook.js
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../../services/api/apiService';

const useRegistryFriendHook = () => {
  const { apiCall } = useApiService();

  const addFriend = async (friendName) => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) {
        throw new Error('사용자 이름을 찾을 수 없습니다.');
      }

      await apiCall({
        method: 'POST',
        url: '/add-friend',
        data: {
          username: storedUsername,
          friendName,
        },
      });

      return true;
    } catch (err) {
      console.error('Error adding friend:', err);
      Alert.alert('오류', err.message || '친구를 추가하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  return { addFriend };
};

export default useRegistryFriendHook;
