// hooks/commentHooks/useUpdateVideoReply.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useUpdateVideoReply = () => {
  const { apiCall, invalidateCache } = useApiService();

  const updateVideoReply = useCallback(
    async (replyId: number, commentText: string): Promise<boolean> => {
      const result = await apiCall<{ success: boolean }>({
        method: 'PUT',
        url: '/update-video-reply',
        data: { replyId, content: commentText },
      });

      invalidateCache('/feed-comment-list'); // 여긴 필요시 경로 변경
      return result.success;
    },
    [apiCall, invalidateCache]
  );

  return { updateVideoReply }; // ✅ 핵심 수정
};
