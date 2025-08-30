import { useState, useEffect, useCallback } from 'react';
import { useApiService } from '../services/api/apiService';

const usePlaceInfo = (placeId, storeName) => {
  const { apiCall } = useApiService();
  const [placeInfo, setPlaceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaceInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall({
        method: 'POST',
        url: 'get-place-info',
        data: { placeId, storeName },
      });
      setPlaceInfo(prev => (prev !== data ? data : prev));
    } catch (err) {
      console.error('API 요청 에러:', err);
      setError(prev => (prev !== err ? err : prev));
    } finally {
      setLoading(false);
    }
  }, [apiCall, placeId, storeName]);

  useEffect(() => {
    if (placeId && storeName) {
      fetchPlaceInfo();
    }
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  return { placeInfo, loading, error, refetch: fetchPlaceInfo };
};

export default usePlaceInfo;
