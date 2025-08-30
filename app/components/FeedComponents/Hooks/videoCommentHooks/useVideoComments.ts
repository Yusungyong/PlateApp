import { useState, useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export const useVideoComments = () => {
  const { apiCall } = useApiService();
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(
    async (storeId: number) => {
      try {
        const data = await apiCall({
          method: 'GET',
          url: '/get-comment',
          params: { storeId },
        });
        setComments(data || []);
        
      } catch (error) {
        console.error('영상 댓글 조회 실패:', error);
      }
    },
    [apiCall]
  );

  return { comments, fetchComments };
};
