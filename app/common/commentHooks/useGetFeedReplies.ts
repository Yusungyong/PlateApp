// hooks/commentHooks/useGetFeedReplies.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useGetFeedReplies = () => {
  const { apiCall } = useApiService();

  const getReplies = useCallback(async (commentId: number): Promise<CommentVO[]> => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/feed-reply-list',
      data: { commentId },
    });
    return result;
  }, [apiCall]);

  return { getReplies };
};
