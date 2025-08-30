// hooks/commentHooks/useGetVideoComments.ts
import { useApiService } from '../../services/api/apiService';
import { useCallback } from 'react';

export const useGetVideoComments = () => {
  const { apiCall } = useApiService();

  const getComments = useCallback(async (storeId: number) => {
    
    return await apiCall({
      method: 'GET',
      url: '/get-comment',
      params: { storeId },
    });
  }, [apiCall]);

  return { getComments };
};
