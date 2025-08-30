// hooks/commentHooks/useUpdateFeedComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useUpdateFeedComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const updateFeedComment = useCallback(
    async (commentId: number, commentText: string): Promise<boolean> => {
      const result = await apiCall<{ success: boolean }>({
        method: 'PUT',
        url: '/update-feed-comment',
        data: { commentId, content : commentText },
      });

      invalidateCache('/feed-comment-list');
      return result.success;
    },
    [apiCall, invalidateCache]
  );

  return { updateFeedComment };
};
