// ✅ hooks/useAutoCompleteSource.ts
import { useEffect, useState } from 'react';
import { useApiService } from '../../../services/api/apiService';

export const useAutoCompleteSource = () => {
  const { apiCall } = useApiService();
  const [source, setSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiCall({
          method: 'GET',
          url: '/autocomplete',
        });
        setSource(data);
      } catch (e) {
        console.error('자동완성 원본 불러오기 실패', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { source, loading };
};
