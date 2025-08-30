import { useState } from 'react';
import { useApiService } from '../../../../services/api/apiService';

export const useSaveFeedSearchFilter = () => {
  const { apiCall, invalidateCache } = useApiService();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const saveSearchFilter = async (filterData: any) => {
    setSaving(true);
    try {
      const data = await apiCall({
        url: '/reg-feed_search_filter',
        method: 'POST',
        data: filterData,
      });
      invalidateCache('/get-feed-serach-filter');
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saveSearchFilter, saving, error };
};
