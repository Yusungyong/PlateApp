import { useState, useEffect } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export interface FilterRequest {
  username: string;
  imageYn: 'Y' | 'N' | 'ALL';
  timeFilter: '1DAY' | '1MONTH' | '3MONTH' | '6MONTH' | '1YEAR' | 'ALL';
  regionFilter: 'MY_PLACE' | 'ACTIVE_PLACE' | 'ALL';
  postSorted: 'OLDPOST' | 'NEWPOST' | 'LIKEPOST';
  postSource: 'MYPOST' | 'FRIENDPOST' | 'ALL';
  filterType: 'feed' | 'video';
}

export const useFeedSearchFilter = (params: FilterRequest) => {
  const { apiCall } = useApiService();
  const [searchFilter, setSearchFilter] = useState<FilterRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchSearchFilter = async () => {
    setLoading(true);
    try {
      const data = await apiCall({
        url: '/get-filter-status',
        method: 'POST',
        data: params,
      });
      setSearchFilter(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchFilter();
  }, []);

  return { searchFilter, loading, error, refetch: fetchSearchFilter };
};
