// hooks/commentHooks/useUpdateVideoComment.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useUpdateVideoComment = () => {
  const { apiCall, invalidateCache } = useApiService();

  const updateVideoComment = useCallback(
    async (commentId: number, commentText: string): Promise<boolean> => {
      const result = await apiCall<{ success: boolean }>({
        method: 'PUT',
        url: '/update-video-comment',
        data: { commentId, content : commentText },
      });

      invalidateCache('/get-comment');
      return result.success;
    },
    [apiCall, invalidateCache]
  );

  return { updateVideoComment };
};
