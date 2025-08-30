// hooks/commentHooks/useAddVideoReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useAddVideoReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const addReply = useCallback(async (comment: CommentVO): Promise<CommentVO[]> => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/reg-reply',
      data: comment,
    });

    invalidateCache('/get-reply'); // 댓글 등록 후 캐시 무효화
    return result;
  }, [apiCall, invalidateCache]);

  return { addReply };
};
