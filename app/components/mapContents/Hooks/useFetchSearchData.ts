// components/MapView/Hooks/useFetchSearchData.ts

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';

const useFetchSearchData = (initialLat: number, initialLng: number, initialRadius: number) => {
  const [searchData, setSearchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { apiCall } = useApiService(); // apiService 사용

  const fetchSearchData = useCallback(async (lat: number, lng: number, rad: number): Promise<any[]> => {
    setLoading(true);
    try {
      const data = await apiCall<any[]>({
        url: 'maps/search-address-data',
        method: 'POST',
        data: {
          latitude: lat,
          longitude: lng,
          radius: rad,
        },
      });

      if (Array.isArray(data)) {
        setSearchData(data);
        await AsyncStorage.setItem('searchData', JSON.stringify(data));
        return data;
      } else {
        setSearchData([]);
        return [];
      }
    } catch (err: any) {
      console.error('❌ Error in fetchSearchData:', err);
      setError(err);
      setSearchData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchSearchData(initialLat, initialLng, initialRadius);
  }, [initialLat, initialLng, initialRadius, fetchSearchData]);

  const refetch = async (lat: number, lng: number, rad: number): Promise<any[]> => {
    return await fetchSearchData(lat, lng, rad);
  };

  return { searchData, loading, error, refetch };
};

export default useFetchSearchData;
