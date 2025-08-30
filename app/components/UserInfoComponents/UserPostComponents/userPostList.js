import { useApiService } from '../../../services/api/apiService';
import { imageBucket } from '../../../config/config';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePostList = (selectedFilter) => {
  const { apiCall } = useApiService();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true); // Start loading
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        setIsLoading(false); // Stop loading
        return;
      }

      const data = await apiCall({
        url: 'file-list',
        method: 'POST',
        data: {
          username,
          code: selectedFilter,
        },
      });

      const updatedItems = data.map((item) => ({
        ...item,
        imageUrl: `${imageBucket}300x300/${item.thumbnail}`,
      }));
      setItems(updatedItems);
    } catch (error) {
      console.error('데이터 가져오기 오류:', error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedFilter]);

  return { items, isLoading };
};

export default usePostList;