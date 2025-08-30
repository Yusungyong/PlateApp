// hooks/commentHooks/useAddFeedComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useAddFeedComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addComment = useCallback(async (comment: CommentVO) => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/feed-add-comment',
      data: comment,
    });

    invalidateCache('/feed-comment-list'); // 필요한 경우 endpoint 확인 권장

    return result;
  }, [apiCall, invalidateCache]);

  return { addComment };
};
