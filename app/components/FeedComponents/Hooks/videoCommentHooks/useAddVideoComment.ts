import { useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAddVideoComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addComment = useCallback(
    async (commentVO) => {
      try {
        const username = await AsyncStorage.getItem('username'); // 로컬에서 username 불러오기

        const fullPayload = {
          ...commentVO,
          username: username || '',
        };

        const data = await apiCall({
          method: 'POST',
          url: '/reg-comment',
          data: fullPayload,
        });
        
        invalidateCache('/get-comment');
        return data || [];
      } catch (error) {
        console.error('영상 댓글 등록 실패:', error);
        return [];
      }
    },
    [apiCall, invalidateCache]
  );

  return { addComment };
};
