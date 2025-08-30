// hooks/commentHooks/useGetVideoComments.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useGetFeedComments = () => {
  const { apiCall } = useApiService();

  const getComments = useCallback(async (feedId: number) => {
    return await apiCall({
      method: 'GET',
      url: '/feed-comment-list',
      params: { feedId },
    });
  }, [apiCall]);

  return { getComments };
};
