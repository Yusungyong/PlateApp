// hooks/commentHooks/useUpdateFeedReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useUpdateFeedReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const updateFeedReply = useCallback(
    async (replyId: number, commentText: string): Promise<boolean> => {
      const result = await apiCall<{ success: boolean }>({
        method: 'PUT',
        url: '/update-feed-reply',
        data: { replyId, content : commentText },
      });

      invalidateCache('/feed-comment-list');
      return result.success;
    },
    [apiCall, invalidateCache]
  );

  return { updateFeedReply };
};
