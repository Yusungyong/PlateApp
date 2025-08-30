import { useState } from 'react';
import { useApiService } from '../../../services/api/apiService';
import {
  UserProfileResponse,
} from './your-types-file-path'; // 경로 맞게 수정
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserProfilePodlist = () => {
  const { apiCall } = useApiService();
  const [data, setData] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // username → userId 등, 서버 요구대로 맞춰줘야 함
  const createUserProfilePodlist = async (username : string) => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await apiCall<UserProfileResponse>({
        method: 'post',
        url: 'user-profile-podlist',
        data: { username }, // { userId } 등 서버 API 파라미터에 맞게 수정
      });
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createUserProfilePodlist };
};

export default useUserProfilePodlist;
