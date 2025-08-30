// components/HomeFavImages/useThumbnails.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApiService } from '../../../services/api/apiService';
import { ThumbnailItem } from './type';

const useThumbnails = (): {
  thumbnails: ThumbnailItem[];
  loading: boolean;
  error: Error | null;
} => {
  const [thumbnails, setThumbnails] = useState<ThumbnailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { apiCall } = useApiService();

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const data = await apiCall<ThumbnailItem[]>({
          method: 'POST',
          url: 'get-home-video-thumbnail',
          data: { username },
        });
        setThumbnails(data.slice(0, 5));
      } catch (err) {
        console.error('썸네일 fetch 실패:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchThumbnails();
  }, []);

  return { thumbnails, loading, error };
};

export default useThumbnails;
