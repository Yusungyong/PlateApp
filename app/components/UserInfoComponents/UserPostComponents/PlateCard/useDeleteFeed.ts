// hooks/useDeleteFeed.ts
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../../services/api/apiService';

export const useDeleteFeed = () => {
  const { apiCall } = useApiService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFeed = useCallback(async (feedId: number) => {
    setLoading(true);
    setError(null);

    try {
      const username = await AsyncStorage.getItem('username');

      const response = await apiCall({
        method: 'POST',
        url: '/delete-feed',
        data: { feedId, username },
      });

      if (response && response.success === true) {

        return true;
      } else {
        throw new Error(response?.message || '삭제 실패');
      }
    } catch (err: any) {
      console.error('❌ 피드 삭제 에러:', err);
      setError(err.message || '알 수 없는 오류');
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { deleteFeed, loading, error };
};
