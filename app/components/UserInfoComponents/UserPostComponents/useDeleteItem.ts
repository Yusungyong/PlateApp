import { useCallback } from 'react';
import { useApiService } from '../../../services/api/apiService';

export const useDeleteItem = () => {
  const { apiCall, invalidateCache } = useApiService();

  const deleteItem = useCallback(async (storeId: number) => {
    try {
      const response = await apiCall({
        url: `/deleteItem/${storeId}`, // ✅ PathVariable 방식에 맞게 URL에 포함
        method: 'DELETE',
      });

      // 캐시 무효화
      invalidateCache('/user-post-list');

      return response;
    } catch (error) {
      console.error('❌ deleteItem 실패:', error);
      throw error;
    }
  }, [apiCall, invalidateCache]);

  return { deleteItem };
};
