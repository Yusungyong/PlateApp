import { useEffect, useState } from 'react';
import { useApiService } from '../../../../services/api/apiService';
// 또는 상대 경로로: import { useApiService } from './apiService';

export interface NewsItem {
  id: number;
  title: string;
  imageUrl: string;
  content: string;
}

const useNews = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { apiCall } = useApiService();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await apiCall<NewsItem[]>({
          method: 'GET',
          url: '/api/news',
        });
        setNewsList(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { newsList, loading, error };
};

export default useNews;
