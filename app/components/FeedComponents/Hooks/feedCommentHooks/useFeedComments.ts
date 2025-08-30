import { useState, useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export const useFeedComments = () => {
  const { apiCall } = useApiService();
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(
    async (feedId: number) => {
      try {
        const data = await apiCall({
          method: 'POST',
          url: '/feed-comment-list',
          data: { feedId },
        });
        setComments(data || []);
        
      } catch (error) {
        console.error('피드 댓글 조회 실패:', error);
      }
    },
    [apiCall]
  );

  return { comments, fetchComments };
};
