// hooks/commentHooks/useDeleteFeedReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useDeleteFeedReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const deleteFeedReply = useCallback(async (replyId: number): Promise<boolean> => {
    const result = await apiCall<{ success: boolean }>({
      method: 'PUT',
      url: '/delete-feed-reply',
      data: { replyId },
    });

    invalidateCache('/feed-comment-list');
    return result.success;
  }, [apiCall, invalidateCache]);

  return { deleteFeedReply };
};
