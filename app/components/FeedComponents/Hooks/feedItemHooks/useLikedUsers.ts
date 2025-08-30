import { useState, useCallback } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export const useLikedUsers = () => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useApiService();

  const fetchLikedUsers = useCallback(async (feedId, storeId) => {
    setLoading(true);
    try {
      // feedId가 있으면 feedId를, 없으면 storeId를 요청 데이터로 사용
      const requestData = feedId ? { feedId } : { storeId };
      const data = await apiCall({
        method: 'POST',
        url: 'get-feed-like-user',
        data: requestData,
      });
      setLikedUsers(data);
    } catch (error) {
      console.error('Error fetching liked users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { likedUsers, fetchLikedUsers, loading };
};
