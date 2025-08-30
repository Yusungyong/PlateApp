// hooks/commentHooks/useDeleteVideoReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useDeleteVideoReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const deleteReply = useCallback(async (replyId: number): Promise<boolean> => {
    const result = await apiCall<{ success: boolean }>({
      method: 'PUT',
      url: '/delete-video-reply',
      data: { replyId },
    });

    invalidateCache('/get-reply');
    return result.success;
  }, [apiCall, invalidateCache]);

  return { deleteReply };
};
