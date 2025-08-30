// hooks/commentHooks/useAddFeedReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useAddFeedReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addReply = useCallback(async (comment: CommentVO): Promise<CommentVO[]> => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/feed-add-reply',
      data: comment,
    });

    invalidateCache('/feed-comment-list');
    return result;
  }, [apiCall, invalidateCache]);

  return { addReply };
};
