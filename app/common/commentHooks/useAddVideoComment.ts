// hooks/commentHooks/useAddVideoComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useAddVideoComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addComment = useCallback(async (comment: CommentVO) => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/reg-comment',
      data: comment,
    });

    // 해당 스토어 댓글 캐시 삭제
    invalidateCache('/get-comment');

    return result;
  }, [apiCall, invalidateCache]);

  return { addComment };
};
