import { useState, useEffect } from 'react';
import { useApiService } from '../../../services/api/apiService';

export const useStoreDetail = (storeName: string, placeId: string) => {
  const { apiCall } = useApiService();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      try {
        setLoading(true);
        const data = await apiCall<any[]>({
          method: 'POST',
          url: '/get-storeDetail',
          data: { storeName, placeId },
        });

        if (mounted) {
          setDetail(data && data.length > 0 ? data[0] : null);
          setError(null);
        }
      } catch (e: any) {
        console.error('상세 조회 실패:', e);
        if (mounted) setError('상세 정보를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (storeName && placeId) {
      loadDetail();
    }

    return () => {
      mounted = false;
    };
  }, [storeName, placeId, apiCall]);

  return { detail, loading, error };
};
