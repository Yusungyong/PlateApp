import { useState } from 'react';

export const useSearchAddress = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');
  const [selectedStoreTelNo, setSelectedStoreTelNo] = useState<string>('');
  const [restaurantAddress, setRestaurantAddress] = useState<string>('');

  const searchAddress = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://openapi.naver.com/v1/search/local.json?query=${query}&display=5`,
        {
          method: 'GET',
          headers: {
            'X-Naver-Client-Id': 'tRElJCITUUFGIKuF5m3M',
            'X-Naver-Client-Secret': 'OlHxBtV5c3',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data.items.slice(0, 2));
    } catch (error) {
      console.error('검색 오류: ', error);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setRestaurantAddress(item.address);
    setQuery(item.address);
    setSelectedStoreName(item.title.replace(/<[^>]*>?/g, ''));
    setSelectedStoreTelNo(item.telephone);
    setSuggestions([]);
  };

  return {
    query,
    setQuery,
    suggestions,
    searchAddress,
    handleSelectSuggestion,
    selectedStoreName,
    selectedStoreTelNo,
    restaurantAddress,
  };
};
