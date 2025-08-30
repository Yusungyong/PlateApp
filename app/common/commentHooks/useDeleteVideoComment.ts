// hooks/commentHooks/useDeleteVideoComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useDeleteVideoComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const deleteComment = useCallback(async (commentId: number): Promise<boolean> => {
    const result = await apiCall<{ success: boolean }>({
      method: 'PUT',
      url: '/delete-video-comment',
      data: { commentId },
    });

    invalidateCache('/get-comment');
    return result.success;
  }, [apiCall, invalidateCache]);

  return { deleteComment };
};
