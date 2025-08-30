// hooks/commentHooks/useDeleteFeedComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useDeleteFeedComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const deleteFeedComment = useCallback(async (commentId: number): Promise<boolean> => {
    const result = await apiCall<{ success: boolean }>({
      method: 'PUT',
      url: '/delete-feed-comment',
      data: { commentId },
    });

    invalidateCache('/feed-comment-list');
    return result.success;
  }, [apiCall, invalidateCache]);

  return { deleteFeedComment };
};
