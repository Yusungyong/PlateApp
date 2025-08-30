// hooks/commentHooks/useGetVideoReplies.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';
import { CommentVO } from '../../types/commentTypes';

export const useGetVideoReplies = () => {
  const { apiCall } = useApiService();

  const getReplies = useCallback(async (commentId: number): Promise<CommentVO[]> => {
    const result = await apiCall<CommentVO[]>({
      method: 'POST',
      url: '/get-reply',
      data: { commentId },
    });
    return result;
  }, [apiCall]);

  return { getReplies };
};
