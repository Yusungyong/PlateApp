import { useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export const useAddFeedComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addComment = useCallback(
    async (feedComment) => {
      try {
        const result = await apiCall({
          method: 'POST',
          url: '/feed-add-comment',
          data: feedComment,
        });

        invalidateCache('/feed-comment-list');
        return result;
      } catch (error) {
        console.error('피드 댓글 등록 실패:', error);
        return null;
      }
    },
    [apiCall, invalidateCache]
  );

  return { addComment };
};
